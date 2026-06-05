'use client'

import { ShoppingCart } from 'lucide-react'
import { FadeIn } from '@/components/ui/animate'
import { getWhatsAppLink } from '@/lib/products'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    image: string
    category_id?: string
  }
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <FadeIn delay={index * 0.05}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-300 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/FFC107/333?text=Produto'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-yellow-50">
              <ShoppingCart size={48} className="text-yellow-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display font-bold text-gray-900 text-base mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
              {product.description}
            </p>
          )}
          <a
            href={getWhatsAppLink(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <ShoppingCart size={16} />
            Comprar no WhatsApp
          </a>
        </div>
      </div>
    </FadeIn>
  )
}
