'use client'

import { useBookingWizard } from '@/context/BookingWizardContext'
import { CheckmarkIcon, SpinnerIcon } from '@/components/Icons'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

export default function ReviewBooking() {
  const { booking, selectedDate, loading, submitBooking, setStep } = useBookingWizard()

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-medium mb-2">Gennemse Booking</h2>
        <p className="text-gray-400 text-sm">Tjek venligst dine oplysninger</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Behandling</h3>
          <p className="text-xl font-serif text-white mb-2">{booking.serviceName}</p>
          <div className="flex justify-between text-sm text-gray-400">
            <span className="font-medium">Varighed:</span>
            <span>{booking.serviceDuration} min</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span className="font-medium">Pris:</span>
            <span className="font-bold text-[#D4AF37]">{booking.servicePrice} kr</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Tidspunkt</h3>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="font-medium">Dato:</span>
            <span>{selectedDate && format(selectedDate, 'EEEE d. MMMM yyyy', { locale: da })}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span className="font-medium">Tid:</span>
            <span className="font-bold text-white">{booking.startTime}</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Dine Oplysninger</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span className="font-medium">Navn:</span>
              <span className="text-white">{booking.customerName}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span className="font-medium">Email:</span>
              <span className="text-white">{booking.customerEmail}</span>
            </div>
            {booking.customerPhone && (
              <div className="flex justify-between text-sm text-gray-400">
                <span className="font-medium">Telefon:</span>
                <span className="text-white">{booking.customerPhone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3.5 border border-white/20 rounded-lg text-gray-300 font-semibold hover:border-white/40 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
        >
          Rediger
        </button>
        <button
          onClick={submitBooking}
          disabled={loading}
          className="flex-1 py-3.5 bg-[#D4AF37] text-black rounded-lg font-bold uppercase tracking-widest hover:bg-[#c5a024] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <SpinnerIcon className="w-4 h-4" />
              Bekræfter...
            </>
          ) : (
            <>
              <CheckmarkIcon className="w-4 h-4" />
              Bekræft Booking
            </>
          )}
        </button>
      </div>
    </div>
  )
}
