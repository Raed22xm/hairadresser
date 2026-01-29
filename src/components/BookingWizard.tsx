/**
 * BookingWizard Component
 * 
 * Reusable booking flow component that can be embedded on any page.
 * Steps: 1. Select Service → 2. Select Date/Time → 3. Enter Details → 4. Confirm
 * 
 * Updated to match Luxury Dark Theme.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Calendar from '@/components/Calendar'
import { format, addDays } from 'date-fns'
import { da } from 'date-fns/locale'
import { CheckmarkIcon, WarningIcon, ClockIcon, SpinnerIcon } from '@/components/Icons'

// Types
interface Service {
    id: string
    name: string
    description: string | null
    durationMinutes: number
    price: string
}

interface QuickSlot {
    date: string
    time: string
    dayName: string
}

interface BookingData {
    serviceId: string
    serviceName: string
    servicePrice: string
    serviceDuration: number
    date: string
    startTime: string
    customerName: string
    customerEmail: string
    customerPhone: string
}

interface ValidationErrors {
    customerName?: string
    customerEmail?: string
}

function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export default function BookingWizard() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedService = searchParams.get('service')

    // State
    const [step, setStep] = useState(1)
    const [services, setServices] = useState<Service[]>([])
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [bookingResult, setBookingResult] = useState<Record<string, unknown> | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const [booking, setBooking] = useState<BookingData>({
        serviceId: preselectedService || '',
        serviceName: '',
        servicePrice: '',
        serviceDuration: 0,
        date: '',
        startTime: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
    })

    // Fetch services on mount
    useEffect(() => {
        fetchServices()
    }, [])

    // If service is preselected
    useEffect(() => {
        if (preselectedService && services.length > 0) {
            const service = services.find(s => s.id === preselectedService)
            if (service) {
                setBooking(prev => ({
                    ...prev,
                    serviceId: service.id,
                    serviceName: service.name,
                    servicePrice: service.price,
                    serviceDuration: service.durationMinutes,
                }))
                setStep(2)
            }
        }
    }, [preselectedService, services])

    async function fetchServices() {
        try {
            const res = await fetch('/api/services')
            const data = await res.json()
            
            if (Array.isArray(data)) {
                setServices(data)
            } else {
                throw new Error(data.error || 'Failed to load services')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to load services')
            setServices([])
        }
    }

    async function fetchSlots(date: Date) {
        setLoading(true)
        setAvailableSlots([])
        try {
            const dateStr = format(date, 'yyyy-MM-dd')
            const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${booking.serviceId}`)
            const data = await res.json()
            setAvailableSlots(data.slots || [])
        } catch {
            setError('Failed to load available times')
        }
        setLoading(false)
    }

    function selectService(service: Service) {
        setBooking(prev => ({
            ...prev,
            serviceId: service.id,
            serviceName: service.name,
            servicePrice: service.price,
            serviceDuration: service.durationMinutes,
        }))
        setStep(2)
    }

    function handleDateSelect(date: Date) {
        setSelectedDate(date)
        setBooking(prev => ({
            ...prev,
            date: format(date, 'yyyy-MM-dd'),
            startTime: '',
        }))
        fetchSlots(date)
    }

    function selectTime(time: string) {
        setBooking(prev => ({ ...prev, startTime: time }))
        setStep(3)
    }

    function validateForm(): boolean {
        const errors: ValidationErrors = {}

        if (!booking.customerName.trim()) {
            errors.customerName = 'Indtast venligst dit navn'
        } else if (booking.customerName.trim().length < 2) {
            errors.customerName = 'Navnet skal være mindst 2 tegn'
        }

        if (!booking.customerEmail.trim()) {
            errors.customerEmail = 'Indtast venligst din email'
        } else if (!isValidEmail(booking.customerEmail)) {
            errors.customerEmail = 'Indtast venligst en gyldig email (f.eks. jens@email.dk)'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function submitBooking() {
        if (!validateForm()) return
        
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: booking.serviceId,
                    date: booking.date,
                    startTime: booking.startTime,
                    customerName: booking.customerName.trim(),
                    customerEmail: booking.customerEmail.trim().toLowerCase(),
                    customerPhone: booking.customerPhone.trim(),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create booking')
            }

            setBookingResult(data)
            setStep(4)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking')
        }
        setLoading(false)
    }

    return (
        <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden border border-white/10 text-white">
            {/* Steps Progress */}
            {step < 5 && (
                <div className="bg-[#0f0f0f] px-6 py-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center flex-1">
                                <div
                                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                        ${step >= s ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-white/10 text-white/30'}
                                    `}
                                >
                                   {step > s ? (
                                     <CheckmarkIcon className="w-5 h-5" />
                                   ) : (
                                     s
                                   )}
                                </div>
                                <span className={`text-xs font-semibold mt-2 text-center transition-colors uppercase tracking-wider ${step >= s ? 'text-[#D4AF37]' : 'text-zinc-600'}`}>
                                   {s === 1 && 'Behandling'}
                                   {s === 2 && 'Tid'}
                                   {s === 3 && 'Detaljer'}
                                   {s === 4 && 'Bekræft'}
                                </span>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6 md:p-10">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                        <WarningIcon className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-medium mb-3">Vælg Behandling</h2>
                            <p className="text-gray-400 text-sm">Vælg den perfekte behandling til dig</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => selectService(service)}
                                    className="group text-left border border-white/10 bg-white/5 rounded-2xl p-6 hover:border-[#D4AF37] hover:bg-white/10 transition-all duration-300"
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
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-medium mb-3">Vælg Tidspunkt</h2>
                            <p className="text-gray-400 font-medium text-sm">
                                {booking.serviceName} <span className="text-[#D4AF37] mx-2">•</span> {booking.servicePrice} kr
                            </p>
                        </div>

                        {/* Calendar */}
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

                            {/* Time Slots */}
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
                )}

                {/* Step 3: Enter Details */}
                {step === 3 && (
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
                                    className={`w-full bg-[#0a0a0a] border text-white rounded-xl px-4 py-3 placeholder-gray-700 outline-none transition-all ${
                                        validationErrors.customerName
                                            ? 'border-red-900 focus:border-red-500'
                                            : 'border-white/10 focus:border-[#D4AF37]'
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
                                    className={`w-full bg-[#0a0a0a] border text-white rounded-xl px-4 py-3 placeholder-gray-700 outline-none transition-all ${
                                        validationErrors.customerEmail
                                            ? 'border-red-900 focus:border-red-500'
                                            : 'border-white/10 focus:border-[#D4AF37]'
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
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl px-4 py-3 placeholder-gray-700 outline-none focus:border-[#D4AF37] transition-all"
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
                                className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 font-semibold hover:border-white hover:text-white transition-all text-sm uppercase tracking-wider"
                            >
                                Tilbage
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                disabled={!agreedToTerms}
                                className="flex-1 py-3 bg-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:bg-[#b08d2b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            >
                                Gennemse Booking
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review Booking */}
                {step === 4 && !bookingResult && (
                    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-medium mb-2">Gennemse Booking</h2>
                            <p className="text-gray-400 text-sm">Tjek venligst dine oplysninger</p>
                        </div>

                        <div className="space-y-4">
                            {/* Service Details */}
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

                            {/* Appointment Details */}
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

                            {/* Customer Details */}
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
                                className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 font-semibold hover:border-white hover:text-white transition-all text-sm uppercase tracking-wider"
                            >
                                Rediger
                            </button>
                            <button
                                onClick={submitBooking}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:bg-[#b08d2b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
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
                )}

                {/* Step 5: Confirmation */}
                {step === 4 && bookingResult && (
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
                            onClick={() => {
                                setStep(1);
                                setBooking({
                                    serviceId: '',
                                    serviceName: '',
                                    servicePrice: '',
                                    serviceDuration: 0,
                                    date: '',
                                    startTime: '',
                                    customerName: '',
                                    customerEmail: '',
                                    customerPhone: '',
                                });
                                setBookingResult(null);
                                setAgreedToTerms(false);
                            }}
                            className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                        >
                            Book En Ny Tid
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
