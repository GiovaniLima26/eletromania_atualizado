'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/layouts/container'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'Contatos', href: '#contatos' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFC107]/95 backdrop-blur-md border-b border-yellow-500/30">
      <Container size="xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src="/logo.png"
                alt="Eletromania Distribuidora logo com raio amarelo"
                fill
                className="object-contain rounded-sm"
                priority
              />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
              Eletromania
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS?.map?.((item: any) => (
              <button
                key={item?.href}
                onClick={() => handleNavClick(item?.href ?? '#')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 hover:bg-yellow-500/40 transition-colors"
              >
                {item?.label ?? ''}
              </button>
            )) ?? []}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-yellow-500/40 transition-colors text-gray-900"
            onClick={() => setMobileOpen((v: boolean) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFC107] border-t border-yellow-500/30 overflow-hidden"
          >
            <Container size="xl">
              <nav className="flex flex-col py-4 gap-1">
                {NAV_ITEMS?.map?.((item: any) => (
                  <button
                    key={item?.href}
                    onClick={() => handleNavClick(item?.href ?? '#')}
                    className="px-4 py-3 rounded-lg text-left text-base font-semibold text-gray-900 hover:bg-yellow-500/40 transition-colors"
                  >
                    {item?.label ?? ''}
                  </button>
                )) ?? []}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
