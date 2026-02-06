import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { TrustedBy } from '@/components/sections/trustedby';
import { Features } from '@/components/sections/features';
import { Pricing } from '@/components/sections/pricing';
import { UseCases } from '@/components/sections/usecases'
import { FAQ } from '@/components/sections/faq'
import { CTA } from '@/components/sections/cta';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <Pricing />
      <UseCases />
      <FAQ />   
      <CTA />
      <Footer />  
    </div>
  );
}