export const WHATSAPP_NUMBER = '554599080143'

export function getWhatsAppLink(productName: string): string {
  const message = encodeURIComponent(
    `Olá! Tenho interesse no produto: *${productName}*. Poderia me passar mais informações?`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

// Categorias padrão iniciais (serão gerenciadas pelo Supabase depois)
export const DEFAULT_CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: 'LayoutGrid' },
]
