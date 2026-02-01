'use client'

import { BookingWizardProvider, useBookingWizard } from '@/context/BookingWizardContext'
import ServiceSelector from '@/components/booking/ServiceSelector'
import DateTimeSelector from '@/components/booking/DateTimeSelector'
import BookingDetailsForm from '@/components/booking/BookingDetailsForm'
import ReviewBooking from '@/components/booking/ReviewBooking'
import ConfirmationSuccess from '@/components/booking/ConfirmationSuccess'
import { CheckmarkIcon, WarningIcon } from '@/components/Icons'

const STEP_LABELS = ['Tjeneste', 'Tid', 'Info', 'Godkend']

function BookingWizardInner() {
  const { step, error, bookingResult } = useBookingWizard()

  return (
    <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden border border-white/10 text-white">
      {step < 5 && (
        <div className="bg-[#0f0f0f] px-4 md:px-6 py-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-9 md:w-10 h-9 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300
                    ${step >= s ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-white/10 text-white/30'}
                  `}
                >
                  {step > s ? (
                    <CheckmarkIcon className="w-4 md:w-5 h-4 md:h-5" />
                  ) : (
                    s
                  )}
                </div>
                <span className={`text-[10px] md:text-xs font-semibold mt-2 text-center transition-colors uppercase tracking-wider ${step >= s ? 'text-[#D4AF37]' : 'text-zinc-600'}`}>
                  {STEP_LABELS[s - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 md:p-10">
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
            <WarningIcon className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && <ServiceSelector />}
        {step === 2 && <DateTimeSelector />}
        {step === 3 && <BookingDetailsForm />}
        {step === 4 && !bookingResult && <ReviewBooking />}
        {step === 4 && bookingResult && <ConfirmationSuccess />}
      </div>
    </div>
  )
}

export default function BookingWizard() {
  return (
    <BookingWizardProvider>
      <BookingWizardInner />
    </BookingWizardProvider>
  )
}
