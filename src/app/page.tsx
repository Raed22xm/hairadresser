/**
 * Homepage Component
 * 
 * Luxury Dark Theme Implementation.
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'
import BookingWizard from '@/components/BookingWizard'
import PricingGrid from '@/components/PricingGrid'
import UserMenu from '@/components/UserMenu'
import { ScissorsIcon, PlayIcon } from '@/components/Icons'

async function getHairdresser() {
  const hairdresser = await prisma.hairdresser.findFirst()
  return hairdresser
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
      <section className="relative h-screen grid md:grid-cols-2 overflow-hidden">
        {/* Left Content */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-20 lg:px-24 bg-[#0f0f0f] pt-20">
             <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1]">
               Bliv den bedste <br/>
               <span className="italic font-light">udgave af dig selv</span>
             </h1>
             
             <p className="text-gray-400 max-w-md mb-12 text-sm leading-relaxed font-light">
               Mere end bare en ny klipning. Det er din bedste klipning, fordi vi ved, hvordan vi får dit look frem. Overlad dit hår til professionelle, der brænder for barberfaget.
             </p>


        </div>
        
        {/* Right Image */}
        <div className="relative h-full hidden md:block">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img 
              src="/man-fade.png" 
              alt="Barber working on client" 
              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:scale-105 transition-all duration-[1.5s] ease-out"
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
         <div className="min-h-[600px] relative overflow-hidden group">
            <img 
               src="/man-sidepart.png" 
               alt="Barber cutting hair" 
               className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:brightness-100 transition-all duration-700"
             />
         </div>

         {/* Right Content */}
         <div className="flex flex-col justify-center px-6 md:px-20 py-24 bg-[#0F0F0F]">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-[1px] bg-[#C5A265]"></div>
               <span className="uppercase tracking-widest text-[#C5A265] text-xs font-bold">Om Os</span>
             </div>

             <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
               “VI GENOPLIVER TRADITIONERNE FOR DET KLASSISKE HERREKLIP”
             </h2>

             <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
               Vi er stolte af vores håndværk og viderefører den fine kunst fra den klassiske frisørsalon. Vores styrke og personlighed ligger i detaljerne: hvor nøje vi lytter til dine ønsker, hvor præcist håret er klippet, hvor lige nakken er, og hvor skarpe bakkenbarterne står.
             </p>

             <p className="text-gray-400 text-sm leading-relaxed mb-12 font-light">
               Vores uovertrufne team af erfarne frisører sætter en ære i hver eneste klipning og barbering. Vi taler om substans og håndværk, ikke om tricks.
             </p>


         </div>
      </section>

      {/* ========================================
          BOOKING SECTION
          ======================================== */}
      <section id="booking" className="py-32 px-4 bg-[#0a0a0a]">
         <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-serif mb-4">Book Din Tid</h2>
                 <p className="text-gray-400 max-w-xl mx-auto">Vælg din behandling og foretrukne frisør for at komme i gang.</p>
             </div>
             <BookingWizard />
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
      <footer id="contact" className="bg-[#050505] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-12 text-sm text-gray-500">
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Frisør Glostrup</h4>
            <p>Eksklusive plejebehandlinger til den moderne gentleman.</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6 text-xs font-bold">Lokation</h4>
            <p>{hairdresser?.address || 'Glostrup, Denmark'}</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6 text-xs font-bold">Åbningstider</h4>
            <p>Man-Fre: 09:00 - 17:00</p>
            <p>Lør: 10:00 - 14:00</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6 text-xs font-bold">Kontakt</h4>
            <p>{hairdresser?.phone || '+45 12 34 56 78'}</p>
            <p className="text-white/50">{hairdresser?.email || 'hello@hairadresser.dk'}</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center text-white/20 text-xs mt-12 pt-8 border-t border-white/5">
          <p>© {new Date().getFullYear()} {hairdresser?.salonName || 'Frisør Glostrup'}. Alle rettigheder forbeholdes.</p>
        </div>
      </footer>
    </div>
  )
}
