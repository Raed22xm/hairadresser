'use client'

import { useBookingWizard } from '@/context/BookingWizardContext'
import { WarningIcon } from '@/components/Icons'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

export default function BookingDetailsForm() {
  const {
    booking, selectedDate, validationErrors, agreedToTerms,
    setBooking, setValidationErrors, setAgreedToTerms, setStep,
  } = useBookingWizard()

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-medium mb-3">Dine Oplysninger</h2>
        <div className="inline-block bg-[#D4AF37]/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          {booking.serviceName} • {selectedDate && format(selectedDate, 'd. MMM', { locale: da })} @ {booking.startTime}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Fulde Navn *</label>
          <input
            type="text"
            value={booking.customerName}
            onChange={(e) => {
              setBooking(prev => ({ ...prev, customerName: e.target.value }))
              if (validationErrors.customerName) setValidationErrors(prev => ({ ...prev, customerName: undefined }))
            }}
            className={`w-full bg-[#050505] border text-white rounded-lg px-4 py-3.5 placeholder-gray-600 outline-none transition-all ${
              validationErrors.customerName
                ? 'border-red-600/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                : 'border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20'
            }`}
            placeholder="Jens Hansen"
            autoFocus
          />
          {validationErrors.customerName && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <WarningIcon className="w-3 h-3 flex-shrink-0" />
              {validationErrors.customerName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email Adresse *</label>
          <input
            type="email"
            value={booking.customerEmail}
            onChange={(e) => {
              setBooking(prev => ({ ...prev, customerEmail: e.target.value }))
              if (validationErrors.customerEmail) setValidationErrors(prev => ({ ...prev, customerEmail: undefined }))
            }}
            className={`w-full bg-[#050505] border text-white rounded-lg px-4 py-3.5 placeholder-gray-600 outline-none transition-all ${
              validationErrors.customerEmail
                ? 'border-red-600/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                : 'border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20'
            }`}
            placeholder="jens@eksempel.dk"
          />
          {validationErrors.customerEmail && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <WarningIcon className="w-3 h-3 flex-shrink-0" />
              {validationErrors.customerEmail}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Telefonnummer <span className="normal-case text-gray-600">(Valgfrit)</span></label>
          <input
            type="tel"
            value={booking.customerPhone}
            onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
            className="w-full bg-[#050505] border border-white/15 text-white rounded-lg px-4 py-3.5 placeholder-gray-600 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
            placeholder="+45 12 34 56 78"
          />
        </div>

        <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border border-white/30 bg-black text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer accent-[#D4AF37]"
          />
          <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer user-select-none">
            Jeg accepterer afbestillingspolitikken og bekræfter, at der ikke gives refusion ved afbestilling.
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3.5 border border-white/20 rounded-lg text-gray-300 font-semibold hover:border-white/40 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
        >
          Tilbage
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!agreedToTerms}
          className="flex-1 py-3.5 bg-[#D4AF37] text-black rounded-lg font-bold uppercase tracking-widest hover:bg-[#c5a024] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
        >
          Gennemse Booking
        </button>
      </div>
    </div>
  )
}
