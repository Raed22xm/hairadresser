/**
 * Homepage Component
 * 
 * Luxury Dark Theme Implementation.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import BookingWizard from '@/components/BookingWizard'
import PricingGrid from '@/components/PricingGrid'
import UserMenu from '@/components/UserMenu'
import { ScissorsIcon } from '@/components/Icons'

export const dynamic = 'force-dynamic'

async function getHairdresser() {
  try {
    const hairdresser = await prisma.hairdresser.findFirst()
    return hairdresser
  } catch (error) {
    console.error('Failed to fetch hairdresser data:', error)
    return null
  }
}

export default async function HomePage() {
  const hairdresser = await getHairdresser()

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-primary selection:text-black">
      {/* ========================================
          HEADER (Navigation)
          ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white py-6">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center bg-transparent">
          {/* Logo Box */}
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37] rounded-full group-hover:bg-[#D4AF37] transition-all duration-300">
                <ScissorsIcon className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37] group-hover:text-black group-hover:fill-black transition-colors" />
             </div>
             <span className="text-xl font-bold font-serif tracking-widest uppercase text-white group-hover:text-[#D4AF37] transition-colors">
               Frisør Glostrup
             </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-12 font-medium tracking-wide text-xs uppercase opacity-80">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Services</Link>
            <Link href="#booking" className="hover:text-[#D4AF37] transition-colors">Booking</Link>
            <Link href="#about" className="hover:text-[#D4AF37] transition-colors">Barbers</Link>
            <Link href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-6">
             <UserMenu />
          </div>
        </div>
      </header>

      {/* ========================================
          HERO SECTION (Split Layout)
          ======================================== */}
      <section className="relative min-h-screen md:h-screen grid md:grid-cols-2 overflow-hidden">
        {/* Left Content */}
        <div className="relative z-10 flex flex-col justify-center px-5 md:px-20 lg:px-24 bg-[#0f0f0f] pt-32 md:pt-20 pb-12 md:pb-0">
             <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1]">
               Bliv den bedste <br/>
               <span className="italic font-light">udgave af dig selv</span>
             </h1>
             
             <p className="text-gray-300 max-w-md mb-12 text-base leading-relaxed font-light">
               Mere end bare en ny klipning. Det er din bedste klipning, fordi vi ved, hvordan vi får dit look frem. Overlad dit hår til professionelle, der brænder for barberfaget.
             </p>
        </div>
        
        {/* Right Image */}
        <div className="relative h-full hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent z-10"></div>
            <img 
              src="/man-fade.png" 
              alt="Barber working on client" 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            
            {/* Social Vertical Text */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-8 text-[10px] items-center text-white/50 font-bold tracking-widest">
               <span className="-rotate-90">FACEBOOK</span>
               <div className="h-12 w-[1px] bg-white/20"></div>
               <span className="-rotate-90">INSTAGRAM</span>
            </div>
        </div>
      </section>

      {/* ========================================
          ABOUT SECTION
          ======================================== */}
      <section id="about" className="grid md:grid-cols-2 bg-[#0a0a0a]">
         {/* Left Image */}
         <div className="h-64 md:min-h-[600px] relative overflow-hidden group order-2 md:order-1">
            <img 
               src="/man-sidepart.png" 
               alt="Barber cutting hair" 
               className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:brightness-100 transition-all duration-700"
             />
         </div>

         {/* Right Content */}
         <div className="flex flex-col justify-center px-5 md:px-24 py-16 md:py-32 bg-[#0F0F0F] order-1 md:order-2">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
               <span className="uppercase tracking-widest text-[#D4AF37] text-xs font-bold">Om Os</span>
             </div>

             <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-tight">
               "VI GENOPLIVER TRADITIONERNE FOR DET KLASSISKE HERREKLIP"
             </h2>

             <p className="text-gray-200 text-base leading-relaxed mb-8 font-light">
               Vi er stolte af vores håndværk og viderefører den fine kunst fra den klassiske frisørsalon. Vores styrke og personlighed ligger i detaljerne: hvor nøje vi lytter til dine ønsker, hvor præcist håret er klippet, hvor lige nakken er, og hvor skarpe bakkenbarterne står.
             </p>

             <p className="text-gray-200 text-base leading-relaxed font-light">
               Vores uovertrufne team af erfarne frisører sætter en ære i hver eneste klipning og barbering. Vi taler om substans og håndværk, ikke om tricks.
             </p>
         </div>
      </section>

      {/* ========================================
          BOOKING SECTION
          ======================================== */}
      <section id="booking" className="py-40 px-4 bg-[#0a0a0a]">
         <div className="max-w-6xl mx-auto">
             <div className="text-center mb-20">
                 <h2 className="text-4xl md:text-5xl font-serif mb-4">Book Din Tid</h2>
                 <p className="text-gray-300 max-w-xl mx-auto text-base">Vælg din behandling og foretrukne frisør for at komme i gang.</p>
             </div>
             <Suspense fallback={
               <div className="flex justify-center p-20">
                 <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4AF37] border-t-transparent"></div>
               </div>
             }>
                <BookingWizard />
             </Suspense>
         </div>
      </section>

      {/* ========================================
          PRICING GRID
          ======================================== */}
      <section id="services">
         <PricingGrid />
      </section>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer id="contact" className="bg-[#050505] border-t border-white/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-4 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 text-sm text-gray-400 mb-12 md:mb-16">
          <div>
            <h4 className="text-white font-serif text-lg mb-6 font-semibold">Frisør Glostrup</h4>
            <p className="text-gray-300 leading-relaxed">Eksklusive plejebehandlinger til den moderne gentleman.</p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M5.953 12a6.047 6.047 0 1112.094 0 6.047 6.047 0 01-12.094 0zm1.25 0a4.797 4.797 0 109.594 0 4.797 4.797 0 00-9.594 0z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest mb-8 text-xs font-bold">Lokation</h4>
            <p className="text-gray-300">{hairdresser?.address || 'Glostrup, Denmark'}</p>
            <p className="text-gray-500 text-xs mt-4">Drivhusvej 8, 2600 Glostrup</p>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest mb-8 text-xs font-bold">Åbningstider</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Mandag-Fredag:</span>
                <span className="text-gray-300 font-medium">09:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lørdag:</span>
                <span className="text-gray-300 font-medium">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Søndag:</span>
                <span className="text-gray-300 font-medium">Lukket</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest mb-8 text-xs font-bold">Kontakt</h4>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="text-gray-500 block text-xs mb-1">Telefon</span>
                {hairdresser?.phone || '+45 12 34 56 78'}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500 block text-xs mb-1">Email</span>
                {hairdresser?.email || 'hello@hairadresser.dk'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-5 md:px-4 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-white/50 text-xs">© {new Date().getFullYear()} {hairdresser?.salonName || 'Frisør Glostrup'}. Alle rettigheder forbeholdes.</p>
            <div className="flex gap-6 text-xs text-white/50">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privatlivspolitik</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Vilkår</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Afbestilling</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
