'use client'

import { useState, useEffect } from 'react'
import { isAdminLoggedIn, setAdminSession, clearAdminSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, Plus, Trash2, Eye, EyeOff, Tag, Package, 
  Save, X, AlertCircle, CheckCircle, Loader2, Camera, Upload
} from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  category_id: string
  image: string
  visible: boolean
}

type Category = {
  id: string
  label: string
  icon: string
}

type Toast = { message: string; type: 'success' | 'error' }

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState<'products' | 'categories'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // Modal produto
  const [showProductModal, setShowProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product>>({})
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Modal categoria
  const [showCatModal, setShowCatModal] = useState(false)
  const [newCatLabel, setNewCatLabel] = useState('')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editingCatLabel, setEditingCatLabel] = useState('')
  const [savingCat, setSavingCat] = useState(false)

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn())
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchData()
    }
  }, [loggedIn])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  async function fetchData() {
    setLoading(true)
    const { data: cats } = await supabase.from('categories').select('*').order('created_at')
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setCategories(cats || [])
    setProducts(prods || [])
    setLoading(false)
  }

  async function handleLogin() {
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setAdminSession()
        setLoggedIn(true)
      } else {
        setLoginError('E-mail ou senha incorretos.')
      }
    } catch {
      setLoginError('Erro ao tentar entrar. Tente novamente.')
    }
  }

  function handleLogout() {
    clearAdminSession()
    setLoggedIn(false)
  }

  // ---- PRODUTOS ----
  function openNewProduct() {
    setEditProduct({ visible: true, name: '', description: '', image: '', category_id: categories[0]?.id || '' })
    setShowProductModal(true)
  }

  async function saveProduct() {
    setSavingProduct(true)
    try {
      if (editProduct.id) {
        await supabase.from('products').update({
          name: editProduct.name,
          description: editProduct.description,
          image: editProduct.image,
          category_id: editProduct.category_id,
          visible: editProduct.visible,
        }).eq('id', editProduct.id)
        setToast({ message: 'Produto atualizado!', type: 'success' })
      } else {
        await supabase.from('products').insert({
          name: editProduct.name || 'Produto sem nome',
          description: editProduct.description || '',
          image: editProduct.image || '',
          category_id: editProduct.category_id || '',
          visible: editProduct.visible ?? true,
        })
        setToast({ message: 'Produto adicionado!', type: 'success' })
      }
      setShowProductModal(false)
      fetchData()
    } catch {
      setToast({ message: 'Erro ao salvar produto.', type: 'error' })
    } finally {
      setSavingProduct(false)
    }
  }

  async function toggleVisible(product: Product) {
    await supabase.from('products').update({ visible: !product.visible }).eq('id', product.id)
    setToast({ message: product.visible ? 'Produto ocultado.' : 'Produto visível.', type: 'success' })
    fetchData()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await supabase.from('products').delete().eq('id', id)
    setToast({ message: 'Produto excluído.', type: 'success' })
    fetchData()
  }

  // ---- CATEGORIAS ----
  async function saveCategory() {
    if (!newCatLabel.trim()) return
    setSavingCat(true)
    const id = newCatLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await supabase.from('categories').insert({ id, label: newCatLabel.trim(), icon: 'Tag' })
    setToast({ message: 'Categoria adicionada!', type: 'success' })
    setNewCatLabel('')
    setShowCatModal(false)
    setSavingCat(false)
    fetchData()
  }
  async function updateCategory(id: string) {
  if (!editingCatLabel.trim()) return
  await supabase.from('categories').update({ label: editingCatLabel.trim() }).eq('id', id)
  setToast({ message: 'Categoria atualizada!', type: 'success' })
  setEditingCatId(null)
  setEditingCatLabel('')
  fetchData()
}
  async function deleteCategory(id: string) {
    if (!confirm('Excluir esta categoria? Os produtos nela não serão apagados.')) return
    await supabase.from('categories').delete().eq('id', id)
    setToast({ message: 'Categoria excluída.', type: 'success' })
    fetchData()
  }

  // ---- LOGIN SCREEN ----
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm border border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFC107] rounded-2xl mb-4">
              <Package size={28} className="text-gray-900" />
            </div>
            <h1 className="text-white font-bold text-xl">Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Eletromania Distribuidora</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 pr-12 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle size={14} /> {loginError}
              </p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-[#FFC107] text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- ADMIN PANEL ----
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFC107] rounded-lg flex items-center justify-center">
            <Package size={18} className="text-gray-900" />
          </div>
          <span className="font-bold text-lg">Painel Admin</span>
          <span className="text-gray-500 text-sm hidden sm:block">— Eletromania Distribuidora</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} /> Sair
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'products' ? 'bg-[#FFC107] text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Package size={16} /> Produtos
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'categories' ? 'bg-[#FFC107] text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Tag size={16} /> Categorias
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Produtos ({products.length})</h2>
              <button
                onClick={openNewProduct}
                className="flex items-center gap-2 bg-[#FFC107] text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
              >
                <Plus size={16} /> Novo Produto
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-yellow-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Package size={48} className="mx-auto mb-4 text-gray-700" />
                <p>Nenhum produto cadastrado ainda.</p>
                <p className="text-sm mt-1">Clique em "Novo Produto" para começar.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => {
                  const cat = categories.find(c => c.id === product.category_id)
                  return (
                    <div key={product.id} className={`bg-gray-900 rounded-xl p-4 border flex items-center gap-4 ${
                      product.visible ? 'border-gray-800' : 'border-gray-800 opacity-60'
                    }`}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/FFC107/333?text=?' }} />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <Package size={24} className="text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{product.name || '(sem nome)'}</p>
                        {product.description && (
                          <p className="text-gray-500 text-sm truncate">{product.description}</p>
                        )}
                        {cat && (
                          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full mt-1">
                            {cat.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleVisible(product)}
                          title={product.visible ? 'Ocultar' : 'Mostrar'}
                          className={`p-2 rounded-lg transition-colors ${
                            product.visible ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                          }`}
                        >
                          {product.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => { setEditProduct(product); setShowProductModal(true) }}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          title="Editar"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Categorias ({categories.length})</h2>
              <button
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-2 bg-[#FFC107] text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
              >
                <Plus size={16} /> Nova Categoria
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-800/50 flex items-center gap-2">
                <Tag size={14} className="text-yellow-400" />
                <span className="text-sm font-semibold text-gray-300">Todos</span>
                <span className="text-xs text-gray-600 ml-1">(padrão — não pode ser removido)</span>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Tag size={40} className="mx-auto mb-3 text-gray-700" />
                <p>Nenhuma categoria criada ainda.</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
                {categories.map((cat) => (
                  <div key={cat.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-yellow-400" />
                      <span className="font-medium">{cat.label}</span>
                      <span className="text-gray-600 text-xs">#{cat.id}</span>
                    </div>
                    {editingCatId === cat.id ? (
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={editingCatLabel}
      onChange={(e) => setEditingCatLabel(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && updateCategory(cat.id)}
      className="bg-gray-800 text-white rounded-lg px-3 py-1 text-sm border border-yellow-400 focus:outline-none"
      autoFocus
    />
    <button
      onClick={() => updateCategory(cat.id)}
      className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
    >
      <Save size={14} />
    </button>
    <button
      onClick={() => setEditingCatId(null)}
      className="p-1.5 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
    >
      <X size={14} />
    </button>
  </div>
) : (
  <div className="flex items-center gap-2">
    <button
      onClick={() => { setEditingCatId(cat.id); setEditingCatLabel(cat.label) }}
      className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
    >
      <Save size={14} />
    </button>
    <button
      onClick={() => deleteCategory(cat.id)}
      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  </div>
)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-bold text-lg">{editProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Nome do produto</label>
                <input
                  type="text"
                  value={editProduct.name || ''}
                  onChange={(e) => setEditProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="Ex: Lâmpada LED 20W"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Descrição (opcional)</label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={(e) => setEditProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400 resize-none"
                  rows={2}
                  placeholder="Breve descrição do produto..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Imagem do produto (opcional)</label>
                {/* Preview */}
                {editProduct.image && (
                  <div className="mb-2 relative w-full h-36 rounded-xl overflow-hidden bg-gray-800">
                    <img src={editProduct.image} alt="preview" className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/FFC107/333?text=Erro' }} />
                    <button onClick={() => setEditProduct(p => ({ ...p, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {/* Upload buttons */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-700 transition-colors">
                    <Upload size={16} />
                    Galeria / Arquivo
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingImage(true)
                        try {
                          const ext = file.name.split('.').pop()
                          const fileName = `produto-${Date.now()}.${ext}`
                          const { error } = await supabase.storage.from('Produtos').upload(fileName, file, { upsert: true })
                          if (error) throw error
                          const { data } = supabase.storage.from('Produtos').getPublicUrl(fileName)
                          setEditProduct(p => ({ ...p, image: data.publicUrl }))
                        } catch { setToast({ message: 'Erro ao fazer upload.', type: 'error' }) }
                        finally { setUploadingImage(false) }
                      }} />
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-700 transition-colors">
                    <Camera size={16} />
                    Câmera
                    <input type="file" accept="image/*" capture="environment" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingImage(true)
                        try {
                          const ext = file.name.split('.').pop()
                          const fileName = `produto-${Date.now()}.${ext}`
                          const { error } = await supabase.storage.from('Produtos').upload(fileName, file, { upsert: true })
                          if (error) throw error
                          const { data } = supabase.storage.from('Produtos').getPublicUrl(fileName)
                          setEditProduct(p => ({ ...p, image: data.publicUrl }))
                        } catch { setToast({ message: 'Erro ao fazer upload.', type: 'error' }) }
                        finally { setUploadingImage(false) }
                      }} />
                  </label>
                </div>
                {uploadingImage && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                    <Loader2 size={14} className="animate-spin" /> Enviando imagem...
                  </div>
                )}
                {/* URL manual */}
                <input
                  type="text"
                  value={editProduct.image || ''}
                  onChange={(e) => setEditProduct(p => ({ ...p, image: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="Ou cole uma URL de imagem..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Categoria</label>
                <select
                  value={editProduct.category_id || ''}
                  onChange={(e) => setEditProduct(p => ({ ...p, category_id: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                >
                  
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditProduct(p => ({ ...p, visible: !p.visible }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editProduct.visible ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {editProduct.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  {editProduct.visible ? 'Visível' : 'Oculto'}
                </button>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveProduct}
                disabled={savingProduct}
                className="flex-1 bg-[#FFC107] text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                {savingProduct ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-sm border border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-bold text-lg">Nova Categoria</h3>
              <button onClick={() => setShowCatModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Nome da categoria</label>
                <input
                  type="text"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveCategory()}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="Ex: Eletrodomésticos"
                  autoFocus
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowCatModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveCategory}
                disabled={savingCat || !newCatLabel.trim()}
                className="flex-1 bg-[#FFC107] text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingCat ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
