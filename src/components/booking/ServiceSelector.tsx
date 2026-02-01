'use client'

import { useBookingWizard } from '@/context/BookingWizardContext'
import { ClockIcon } from '@/components/Icons'

export default function ServiceSelector() {
  const { services, selectService } = useBookingWizard()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-medium mb-3">Vælg Behandling</h2>
        <p className="text-gray-400 text-sm">Vælg den perfekte behandling til dig</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => selectService(service)}
            className="group text-left border border-white/15 bg-white/5 rounded-2xl p-7 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">
                  {service.name}
                </h3>
              </div>
              <span className="font-bold text-lg text-[#D4AF37] ml-4 whitespace-nowrap">{service.price} kr</span>
            </div>
            <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 w-fit px-3 py-1.5 rounded border border-white/5 group-hover:border-white/20 transition-colors">
              <ClockIcon className="w-3 h-3" />
              <span>{service.durationMinutes} min</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
