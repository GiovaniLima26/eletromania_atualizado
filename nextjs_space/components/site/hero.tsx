'use client'

import Image from 'next/image'
import { Zap, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Container } from '@/components/layouts/container'

export function Hero() {
  const scrollToProducts = () => {
    const el = document.querySelector('#produtos')
    el?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#FFC107] via-[#FFD54F] to-[#FFECB3] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'https://lh4.googleusercontent.com/Ki309swxJtWYakp2nypvE4UjcgYC0uHBduyuyWzr_pamfzXFHjSlctrfAx1XPJYjk8LIECMlbRkvumjbT1TJkM225HiIggoy3lnu508mDUyDlHfRB2tog1VY82GLMcP61LK6GOO9 fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <Container size="xl" className="relative z-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-gray-900/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Zap size={16} className="text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Distribuidora de confiança</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Eletromania
              <br />
              <span className="text-gray-800/80">Distribuidora</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-800 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Qualidade, <strong>variedade</strong> e bom atendimento.
              <br className="hidden sm:block" />
              Tudo o que você precisa para seu carro, seu pet e sua casa.
            </p>

            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 bg-gray-900 text-yellow-400 font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
            >
              <ShoppingBag size={20} />
              Ver Produtos
            </button>
          </motion.div>

          {/* Logo image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gray-900/10 rounded-3xl rotate-6" />
              <div className="relative w-full h-full bg-[#FFC107] rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-900/10">
                <Image
                  src="/logo.png"
                  alt="Eletromania Distribuidora - Logo com raio amarelo e preto"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
