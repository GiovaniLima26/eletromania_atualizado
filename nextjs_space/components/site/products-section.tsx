'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, LayoutGrid } from 'lucide-react'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { FadeIn } from '@/components/ui/animate'
import { ProductCard } from './product-card'
import { supabase } from '@/lib/supabase'

export function ProductsSection() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [restored, setRestored] = useState(false)

  // Restaura o filtro de busca/categoria salvos ao montar o componente
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('eletromania:filters')
      if (saved) {
        const { search: savedSearch, activeCategory: savedCategory } = JSON.parse(saved)
        if (savedSearch) setSearch(savedSearch)
        if (savedCategory) setActiveCategory(savedCategory)
      }
    } catch (e) {
      console.error('Erro ao restaurar filtros:', e)
    } finally {
      setRestored(true)
    }
  }, [])

  // Salva o filtro de busca/categoria sempre que mudar
  useEffect(() => {
    if (!restored) return
    try {
      sessionStorage.setItem('eletromania:filters', JSON.stringify({ search, activeCategory }))
    } catch (e) {
      console.error('Erro ao salvar filtros:', e)
    }
  }, [search, activeCategory, restored])

  // Restaura a posição de scroll salva, depois que os produtos carregarem.
  // Espera a altura da página parar de mudar (imagens/animações carregando)
  // antes de restaurar, e faz isso só UMA vez — se o usuário rolar ou
  // tocar na tela manualmente, cancela na hora pra não "brigar" com ele.
  useEffect(() => {
    if (loading) return
    const savedScroll = sessionStorage.getItem('eletromania:scroll')
    if (!savedScroll) return

    sessionStorage.removeItem('eletromania:scroll')
    const targetY = parseInt(savedScroll, 10)

    let cancelled = false
    let lastHeight = document.documentElement.scrollHeight
    let stableCount = 0
    let checkInterval: ReturnType<typeof setInterval>

    function cancel() {
      cancelled = true
      clearInterval(checkInterval)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchmove', cancel)
      window.removeEventListener('keydown', onKeyDown)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        cancel()
      }
    }

    // Cancela se o usuário tentar rolar manualmente enquanto esperamos
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchmove', cancel, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    checkInterval = setInterval(() => {
      if (cancelled) return

      const currentHeight = document.documentElement.scrollHeight
      if (currentHeight === lastHeight) {
        stableCount++
      } else {
        stableCount = 0
        lastHeight = currentHeight
      }

      // Altura estável por 2 checagens seguidas (200ms) = layout pronto
      if (stableCount >= 2) {
        window.scrollTo({ top: targetY, behavior: 'auto' })
        cancel()
      }
    }, 100)

    // Limite de segurança: para de tentar depois de 2 segundos
    const timeout = setTimeout(cancel, 2000)

    return () => {
      cancel()
      clearTimeout(timeout)
    }
  }, [loading])

  // Salva a posição de scroll ao fechar/recarregar a aba.
  // (A navegação para a página de produto já é coberta pelo onClick
  // dentro do ProductCard — não duplicar aqui no cleanup, pois o cleanup
  // roda DEPOIS que a nova página já montou e o scroll já é 0, o que
  // sobrescreveria o valor certo com zero.)
  useEffect(() => {
    function saveScroll() {
      try {
        sessionStorage.setItem('eletromania:scroll', String(window.scrollY))
      } catch (e) {
        console.error('Erro ao salvar scroll:', e)
      }
    }
    window.addEventListener('beforeunload', saveScroll)
    return () => {
      window.removeEventListener('beforeunload', saveScroll)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data: cats } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true })

        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .eq('visible', true)
          .order('created_at', { ascending: false })

        setCategories(cats || [])
        setProducts(prods || [])
      } catch (e) {
        console.error('Erro ao carregar dados:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const allCategories = useMemo(() => [
    ...categories,
  ], [categories])

  function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const filtered = useMemo(() => {
  return products.filter((p) => {
    const matchesCategory = activeCategory !== '' && p.category_id === activeCategory
    const matchesSearch = !search ||
      normalize(p.name || '').includes(normalize(search)) ||
      normalize(p.description || '').includes(normalize(search))
    return matchesCategory && matchesSearch
  })
}, [search, activeCategory, products])

  return (
    <Section id="produtos" className="bg-gradient-to-b from-white to-amber-50/50">
      <Container size="xl">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Nossos Produtos
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Encontre tudo o que precisa com qualidade e bom atendimento.
            </p>
          </div>
        </FadeIn>

        {/* Search + Filters */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FFC107] text-gray-900 shadow-md'
                        : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
              ) : !activeCategory ? (
          <FadeIn>
            <div className="text-center py-16">
              <LayoutGrid size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Selecione uma categoria para ver os produtos.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
              <p className="text-gray-400 text-sm mt-1">Tente buscar com outras palavras.</p>
            </div>
          </FadeIn>
        )}
      </Container>
    </Section>
  )
}
