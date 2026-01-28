/**
 * Homepage Component
 * 
 * The main landing page for Hairadresser Salon.
 * Features a seamless, embedded booking wizard.
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'
import BookingWizard from '@/components/BookingWizard'
import PricingGrid from '@/components/PricingGrid'
import { ScissorsIcon } from '@/components/Icons'

async function getHairdresser() {
  const hairdresser = await prisma.hairdresser.findFirst()
  return hairdresser
}

export default async function HomePage() {
  const hairdresser = await getHairdresser()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ========================================
          HEADER SECTION
          ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* Salon Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-7 h-7 group-hover:rotate-12 transition-transform" style={{ color: 'var(--color-primary, #D4AF37)' }}>
              <ScissorsIcon className="w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                {hairdresser?.salonName || 'Hairadresser'}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/account"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              My Account
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================================
          MAIN CONTENT
          ======================================== */}
      <main className="min-h-screen relative">
        <div className="relative z-10 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Text */}
                <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-6">
                      <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary, #D4AF37)' }}>
                        Premium Hair Care
                      </p>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                        Become the best<br />version of yourself
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-medium">
                        Experience premium hair styling and grooming services. We revive the traditions of the classic men's haircut with modern techniques and personalized care.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-12 items-start animate-in fade-in zoom-in-95 duration-700 delay-150">

                    {/* Booking Wizard (Primary) */}
                    <div className="lg:col-span-7 shadow-2xl rounded-3xl overflow-hidden z-20 relative">
                        <BookingWizard />
                    </div>

                    {/* Feature Image & Gallery Side */}
                    <div className="lg:col-span-5 flex flex-col gap-6 hidden md:flex">
                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group min-h-[400px] flex-1 border border-white/10">
                            <img
                                src="/man-fade.png"
                                alt="Men's Fade Cut"
                                className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                                <h3 className="text-3xl font-bold mb-2">Precision Styling</h3>
                                <p className="text-gray-300">Masterful fade cuts and beard grooming for the modern gentleman.</p>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary, #D4AF37)', color: 'black' }}>Fade Cut</span>
                                    <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary, #D4AF37)', color: 'black' }}>Beard Trim</span>
                                </div>
                            </div>
                        </div>

                        {/* Style Gallery Bar */}
                        <div className="grid grid-cols-3 gap-3">
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/10">
                                <img src="/man-crop.png" alt="Textured Crop" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Crop</span>
                             </div>
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/10">
                                <img src="/man-sidepart.png" alt="Side Part" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Classic</span>
                             </div>
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/10">
                                <img src="/man-buzz.png" alt="Buzz Cut" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Buzz</span>
                             </div>
                        </div>
                    </div>

                </div>

            {/* Info Footer */}
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-center text-sm border-t border-white/10 pt-12">
                <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-primary, #D4AF37)' }}>Location</h3>
                    <p className="text-white/70">{hairdresser?.address || 'Copenhagen, Denmark'}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-primary, #D4AF37)' }}>Hours</h3>
                    <p className="text-white/70">Mon-Fri: 09:00 - 17:00</p>
                    <p className="text-white/70">Sat: 10:00 - 14:00</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-primary, #D4AF37)' }}>Contact</h3>
                    <p className="text-white/70">{hairdresser?.phone || '+45 12 34 56 78'}</p>
                    <p className="text-white/70">{hairdresser?.email || 'hello@hairadresser.dk'}</p>
                </div>
            </div>
        </div>
        </div>
      </main>

      {/* ========================================
          PRICING GRID
          ======================================== */}
      <PricingGrid />

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} {hairdresser?.salonName || 'Hairadresser'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
