'use client'

import { useBookingWizard } from '@/context/BookingWizardContext'
import { CheckmarkIcon } from '@/components/Icons'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

export default function ConfirmationSuccess() {
  const { booking, selectedDate, resetWizard } = useBookingWizard()

  return (
    <div className="text-center animate-in zoom-in-95 duration-500 py-8">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20">
        <CheckmarkIcon className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-serif font-medium mb-2 text-white">Booking Bekræftet!</h2>
      <p className="text-gray-400 mb-8">En bekræftelsesmail er sendt til <span className="font-semibold text-white">{booking.customerEmail}</span></p>

      <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10 text-left space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium">Behandling</span>
          <span className="font-bold text-white">{booking.serviceName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium">Dato & Tid</span>
          <span className="font-bold text-white">{selectedDate && format(selectedDate, 'd. MMM', { locale: da })} kl. {booking.startTime}</span>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-[#D4AF37] font-bold">Total</span>
          <span className="text-2xl font-bold text-[#D4AF37]">{booking.servicePrice} kr</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-6">Dit bookingnummer findes i mailen.</p>

      <button
        onClick={resetWizard}
        className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
      >
        Book En Ny Tid
      </button>
    </div>
  )
}
