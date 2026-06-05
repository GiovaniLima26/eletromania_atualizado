'use client'

import { MessageCircle, Mail, Instagram, Zap } from 'lucide-react'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { FadeIn } from '@/components/ui/animate'
import { WHATSAPP_NUMBER } from '@/lib/products'

const CONTACTS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '(45) 99080-143',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.')}`,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'eletromaniadistribuidora@gmail.com',
    href: 'mailto:eletromaniadistribuidora@gmail.com',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@eletro_mania_veco_',
    href: 'https://www.instagram.com/eletro_mania_veco_',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
  },
]

export function ContactsSection() {
  return (
    <Section id="contatos" className="bg-gray-900">
      <Container size="xl">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Fale Conosco
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Entre em contato pelos nossos canais de atendimento.
            </p>
          </div>
        </FadeIn>

        {/* Contacts centralizados */}
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {CONTACTS.map((contact, index) => {
            const Icon = contact.icon
            return (
              <FadeIn key={contact.label} delay={index * 0.1}>
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-yellow-500/30 w-52"
                >
                  <div className={`${contact.color} ${contact.hoverColor} p-4 rounded-xl mb-4 transition-colors`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-white text-base mb-1">
                    {contact.label}
                  </h3>
                  <p className="text-gray-400 text-sm text-center break-all">
                    {contact.value}
                  </p>
                </a>
              </FadeIn>
            )
          })}
        </div>

        {/* Footer */}
        <FadeIn delay={0.4}>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap size={20} className="text-[#FFC107]" />
              <span className="font-display font-bold text-white text-lg">Eletromania Distribuidora</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Qualidade, variedade e bom atendimento.
            </p>
            {/* Desenvolvido por - Instagram do dev */}
            <a
              href="https://www.instagram.com/giiba_lima?igsh=MWE2Mm45d2ZtYWo3aA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-pink-400 transition-colors text-xs"
            >
              <span>Desenvolvido por</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@giiba_lima</span>
            </a>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
