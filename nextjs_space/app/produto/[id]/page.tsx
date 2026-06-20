'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, ShoppingBag } from 'lucide-react'
import { supabase, type Product } from '@/lib/supabase'
import { getWhatsAppLink } from '@/lib/products'
import { ShareButtons } from '@/components/site/share-buttons'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [productUrl, setProductUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProductUrl(window.location.href)
    }
  }, [])

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('visible', true)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-yellow-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-display font-bold text-gray-900 mb-2">
          Produto não encontrado
        </h1>
        <p className="text-gray-500 mb-6">
          Esse produto pode não estar mais disponível.
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 px-5 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar para a loja
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar para a loja
        </button>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 sm:flex">
          <div className="relative aspect-square w-full sm:w-2/5 sm:aspect-auto bg-gray-50 flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/FFC107/333?text=Produto'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                <ShoppingCart size={64} className="text-yellow-300" />
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 sm:flex-1 sm:flex sm:flex-col">
            <h1 className="font-display font-bold text-gray-900 text-xl sm:text-2xl mb-2">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {product.description}
              </p>
            )}

            
            <a href={getWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold py-3 px-6 rounded-xl transition-colors text-base mb-4"
            >
              <ShoppingCart size={20} />
              Comprar no WhatsApp
            </a>

            <div className="border-t border-gray-100 pt-4 mt-auto">
              {productUrl && (
                <ShareButtons productName={product.name} productUrl={productUrl} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}