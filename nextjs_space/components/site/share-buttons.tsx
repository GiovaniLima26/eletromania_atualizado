'use client'

import { useState } from 'react'
import { Facebook, Instagram, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  productName: string
  productUrl: string
}

export function ShareButtons({ productName, productUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Olha esse produto: ${productName}`

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback caso o navegador bloqueie a API de clipboard
      const input = document.createElement('input')
      input.value = productUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleInstagramClick() {
    // O Instagram não tem um endpoint de compartilhamento de link como
    // o Facebook ou o WhatsApp. A prática comum é copiar o link e abrir
    // o Instagram para a pessoa colar no Direct ou nos Stories.
    handleCopyLink()
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-2">Compartilhar:</p>
      <div className="flex flex-wrap gap-2">
        
        <a  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no WhatsApp"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#25D366] hover:bg-[#20c05c] text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.149.347-.347.52-.521.173-.174.23-.298.347-.497.116-.198.058-.347-.025-.495-.083-.149-.624-1.5-.851-2.059-.226-.561-.456-.485-.624-.494-.16-.008-.347-.01-.534-.01-.187 0-.49.07-.749.337-.258.267-.984.96-.984 2.34 0 1.38.984 2.71 1.123 2.91.14.198 1.911 2.917 4.629 3.973 2.718 1.057 2.718.704 3.21.661.49-.042 1.595-.652 1.82-1.282.224-.629.224-1.169.157-1.282-.067-.114-.249-.181-.521-.318z" />
            <path d="M12.04 2c-5.523 0-10 4.477-10 10 0 1.84.503 3.564 1.378 5.04L2 22l5.04-1.378A9.95 9.95 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.18c-1.621 0-3.13-.475-4.405-1.292l-.316-.198-3.024.827.83-3.01-.207-.327a8.18 8.18 0 01-1.298-4.42c0-4.527 3.683-8.21 8.21-8.21 4.527 0 8.21 3.683 8.21 8.21 0 4.527-3.683 8.21-8.21 8.21z" />
          </svg>
        </a>

        
        <a href={facebookLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Facebook"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#1877F2] hover:bg-[#1467d4] text-white transition-colors"
        >
          <Facebook size={20} fill="currentColor" />
        </a>

        <button
          type="button"
          onClick={handleInstagramClick}
          aria-label="Compartilhar no Instagram (copia o link e abre o Instagram)"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-opacity hover:opacity-90"
        >
          <Instagram size={20} />
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copiar link do produto"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          {copied ? <Check size={20} className="text-green-600" /> : <Link2 size={20} />}
        </button>
      </div>
      {copied && (
        <p className="text-xs text-green-600 mt-1.5">Link copiado!</p>
      )}
    </div>
  )
}