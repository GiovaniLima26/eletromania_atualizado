import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { ProductsSection } from '@/components/site/products-section'
import { LocationSection } from '@/components/site/location-section'
import { ContactsSection } from '@/components/site/contacts-section'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductsSection />
      <LocationSection />
      <ContactsSection />
    </main>
  )
}
