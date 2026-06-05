'use client'

import { MapPin, Clock, Phone } from 'lucide-react'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { FadeIn, SlideIn } from '@/components/ui/animate'

export function LocationSection() {
  return (
    <Section id="localizacao" className="bg-gray-50">
      <Container size="xl">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Nossa Localização
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Venha nos visitar! Estamos prontos para atendê-lo.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <SlideIn from="left">
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 aspect-video lg:aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.1211291135915!2d-53.882163823744335!3d-25.063883318508104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3e362e64a8d97%3A0xfd92bec7563c22ea!2sR.%20Carlos%20Pernichele%2C%20410%2C%20Vera%20Cruz%20do%20Oeste%20-%20PR%2C%2085845-000!5e0!3m2!1spt-BR!2sbr!4v1780528508863!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Eletromania Distribuidora no mapa"
              />
            </div>
          </SlideIn>

          {/* Info */}
          <SlideIn from="right">
            <div className="flex flex-col gap-6 justify-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFC107] p-3 rounded-xl">
                    <MapPin size={24} className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-1">Endereço</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Rua Carlos Perninchelli, 410 - Centro
                      <br />
                      Vera Cruz do Oeste - PR
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFC107] p-3 rounded-xl">
                    <Clock size={24} className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-1">Horário de Funcionamento</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Segunda a Sexta: 8h às 12h — 13h15 às 18h
                      <br />
                      Sábado: 8h às 12h — 13h15 às 16h30
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFC107] p-3 rounded-xl">
                    <Phone size={24} className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-1">Telefone</h3>
                    <p className="text-gray-600 leading-relaxed">
                      (45) 99080-143
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </Container>
    </Section>
  )
}
