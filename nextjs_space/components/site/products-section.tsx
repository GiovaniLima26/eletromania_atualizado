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
  const [activeCategory, setActiveCategory] = useState('todos')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    { id: 'todos', label: 'Todos', icon: 'LayoutGrid' },
    ...categories,
  ], [categories])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'todos' || p.category_id === activeCategory
      const matchesSearch = !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
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
