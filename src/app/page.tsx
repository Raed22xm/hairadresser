/**
 * Homepage Component
 * 
 * The main landing page for Hairadresser Salon.
 * Features a seamless, embedded booking wizard.
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'
import BookingWizard from '@/components/BookingWizard'
import { ScissorsIcon } from '@/components/Icons'

async function getHairdresser() {
  const hairdresser = await prisma.hairdresser.findFirst()
  return hairdresser
}

export default async function HomePage() {
  const hairdresser = await getHairdresser()

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ========================================
          HEADER SECTION
          ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* Salon Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-7 h-7 group-hover:rotate-12 transition-transform text-black">
              <ScissorsIcon className="w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
                {hairdresser?.salonName || 'Hairadresser'}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/account"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
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
        {/* Background Image with Overlay */}
        <div className="absolute inset-x-0 top-0 h-[600px] z-0">
             <div className="relative w-full h-full">
                {/* Image Placeholder - In production use next/image */}
                <img 
                    src="/salon-interior.png" 
                    alt="Salon Interior" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
             </div>
        </div>

        <div className="relative z-10 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Text */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-black drop-shadow-sm">
                        Style & Elegance.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                        Experience premium hair care in the heart of Copenhagen.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in zoom-in-95 duration-700 delay-150">
                    
                    {/* Booking Wizard (Primary) */}
                    <div className="lg:col-span-7 shadow-2xl rounded-3xl overflow-hidden bg-white z-20 relative">
                        <BookingWizard />
                    </div>

                    {/* Feature Image & Gallery Side */}
                    <div className="lg:col-span-5 flex flex-col gap-4 hidden md:flex">
                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group min-h-[400px] flex-1">
                            <img 
                                src="/man-fade.png" 
                                alt="Men's Fade Cut" 
                                className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                                <h3 className="text-3xl font-bold mb-2">Precision Styling</h3>
                                <p className="text-gray-300">Masterful fade cuts and beard grooming for the modern gentleman.</p>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">Fade Cut</span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">Beard Trim</span>
                                </div>
                            </div>
                        </div>

                        {/* Style Gallery Bar */}
                        <div className="grid grid-cols-3 gap-3">
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                                <img src="/man-crop.png" alt="Textured Crop" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Crop</span>
                             </div>
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                                <img src="/man-sidepart.png" alt="Side Part" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Classic</span>
                             </div>
                             <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                                <img src="/man-buzz.png" alt="Buzz Cut" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"/>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"/>
                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider opacity-90">Buzz</span>
                             </div>
                        </div>
                    </div>

                </div>

            {/* Info Footer */}
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-12">
                <div>
                    <h3 className="font-semibold text-black mb-2">Location</h3>
                    <p>{hairdresser?.address || 'Copenhagen, Denmark'}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-black mb-2">Hours</h3>
                    <p>Mon-Fri: 09:00 - 17:00</p>
                    <p>Sat: 10:00 - 14:00</p>
                </div>
                <div>
                    <h3 className="font-semibold text-black mb-2">Contact</h3>
                    <p>{hairdresser?.phone || '+45 12 34 56 78'}</p>
                    <p>{hairdresser?.email || 'hello@hairadresser.dk'}</p>
                </div>
            </div>
        </div>
        </div>
      </main>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {hairdresser?.salonName || 'Hairadresser'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
