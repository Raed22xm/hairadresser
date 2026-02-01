'use client'

import { useBookingWizard } from '@/context/BookingWizardContext'
import Calendar from '@/components/Calendar'
import { addDays } from 'date-fns'

export default function DateTimeSelector() {
  const {
    booking, selectedDate, availableSlots, loading,
    handleDateSelect, selectTime, setStep, setSelectedDate, setAvailableSlots,
  } = useBookingWizard()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-medium mb-3">Vælg Tidspunkt</h2>
        <p className="text-gray-400 font-medium text-sm">
          {booking.serviceName} <span className="text-[#D4AF37] mx-2">•</span> {booking.servicePrice} kr
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="dark-theme-calendar border border-white/10 rounded-xl p-4 bg-white/5">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            disabledDays={[0]}
          />
        </div>

        {selectedDate && (
          <div className="mt-8 animate-in slide-in-from-top-2">
            <h3 className="text-xs font-bold text-gray-500 mb-5 text-center uppercase tracking-widest">
              Ledige Tider
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#D4AF37] border-t-transparent"></div>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => selectTime(time)}
                    className="py-3 rounded-lg text-sm font-bold transition-all bg-transparent border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5"
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-sm text-gray-400">
                Ingen ledige tider denne dag. Prøv venligst en anden dato.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => { setStep(1); setSelectedDate(null); setAvailableSlots([]); }}
          className="text-gray-500 hover:text-white text-xs font-bold transition-colors uppercase tracking-widest"
        >
          ← Skift Behandling
        </button>
      </div>
    </div>
  )
}
