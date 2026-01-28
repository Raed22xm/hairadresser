/**
 * BookingWizard Component
 * 
 * Reusable booking flow component that can be embedded on any page.
 * Steps: 1. Select Service → 2. Select Date/Time → 3. Enter Details → 4. Confirm
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
    const [quickSlots, setQuickSlots] = useState<QuickSlot[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [bookingResult, setBookingResult] = useState<Record<string, unknown> | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showCalendar, setShowCalendar] = useState(false)
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

    // Fetch quick slots when service is selected
    const fetchQuickSlots = useCallback(async (serviceId: string) => {
        try {
            const res = await fetch(`/api/availability/next?serviceId=${serviceId}&limit=6`)
            const data = await res.json()
            setQuickSlots(data.slots || [])
        } catch {
            console.error('Failed to fetch quick slots')
        }
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
                fetchQuickSlots(service.id)
                setStep(2)
            }
        }
    }, [preselectedService, services, fetchQuickSlots])

    async function fetchServices() {
        try {
            const res = await fetch('/api/services')
            const data = await res.json()
            setServices(data)
        } catch {
            setError('Failed to load services')
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
        fetchQuickSlots(service.id)
        setStep(2)
    }

    function selectQuickSlot(slot: QuickSlot) {
        const date = new Date(slot.date)
        setSelectedDate(date)
        setBooking(prev => ({
            ...prev,
            date: slot.date,
            startTime: slot.time,
        }))
        setStep(3)
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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Steps Progress */}
            {step < 5 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center flex-1">
                                <div
                                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                        ${step >= s ? 'bg-black text-white shadow-lg' : 'bg-gray-200 text-gray-500'}
                                    `}
                                >
                                   {step > s ? (
                                     <CheckmarkIcon className="w-5 h-5" />
                                   ) : (
                                     s
                                   )}
                                </div>
                                <span className={`text-xs font-semibold mt-2 text-center transition-colors ${step >= s ? 'text-black' : 'text-gray-400'}`}>
                                   {s === 1 && 'Behandling'}
                                   {s === 2 && 'Tid'}
                                   {s === 3 && 'Detaljer'}
                                   {s === 4 && 'Godkend'}
                                </span>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6 md:p-10">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                        <WarningIcon className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-3">Vælg Behandling</h2>
                            <p className="text-gray-600 text-base">Vælg den perfekte behandling til dig</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => selectService(service)}
                                    className="group text-left border-2 border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-black group-hover:text-black transition-colors">
                                                {service.name}
                                            </h3>
                                        </div>
                                        <span className="font-bold text-xl text-black ml-4 whitespace-nowrap">{service.price} kr</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 w-fit px-3 py-2 rounded-lg group-hover:bg-gray-200 transition-colors">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{service.durationMinutes} minutter</span>
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
                            <h2 className="text-3xl font-bold mb-3">Vælg Tidspunkt</h2>
                            <p className="text-gray-600 font-medium">
                                {booking.serviceName} <span className="text-black font-bold">• {booking.servicePrice} kr</span>
                            </p>
                        </div>

                        {/* Quick Book Section */}
                        {quickSlots.length > 0 && !showCalendar && (
                            <div className="mb-10">
                                <h3 className="font-bold text-gray-900 text-lg mb-5">Næste Ledige Tider</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {quickSlots.map((slot, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectQuickSlot(slot)}
                                            className="group border-2 border-gray-200 rounded-2xl p-4 text-left hover:border-black hover:bg-black/5 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="font-bold text-xl text-black group-hover:text-black">
                                                {slot.time}
                                            </div>
                                            <div className="text-gray-600 text-xs font-semibold uppercase tracking-widest mt-2">
                                                {slot.dayName}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setShowCalendar(true)}
                                        className="text-gray-700 hover:text-black text-sm font-semibold underline underline-offset-4 transition-colors"
                                    >
                                        Se kalender
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Calendar (shown when requested or no quick slots) */}
                        {(showCalendar || quickSlots.length === 0) && (
                            <div className="max-w-md mx-auto">
                                <Calendar
                                    selectedDate={selectedDate}
                                    onSelectDate={handleDateSelect}
                                    minDate={new Date()}
                                    maxDate={addDays(new Date(), 30)}
                                    disabledDays={[0]}
                                />

                                {/* Time Slots */}
                                {selectedDate && (
                                    <div className="mt-8 animate-in slide-in-from-top-2">
                                        <h3 className="text-sm font-bold text-gray-600 mb-5 text-center uppercase tracking-wider">
                                            Ledige tider
                                        </h3>

                                        {loading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {availableSlots.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => selectTime(time)}
                                                        className="py-3 rounded-lg text-sm font-bold transition-all bg-white border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white"
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 rounded-xl p-6 text-center text-sm text-gray-600 font-medium">
                                                Ingen ledige tider denne dag. Prøv venligst en anden dag.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showCalendar && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => setShowCalendar(false)}
                                            className="text-gray-700 hover:text-black text-sm font-semibold underline underline-offset-4"
                                        >
                                            Tilbage til hurtig visning
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 text-center">
                             <button
                                onClick={() => { setStep(1); setSelectedDate(null); setAvailableSlots([]); setShowCalendar(false); }}
                                className="text-gray-600 hover:text-black text-sm font-semibold transition-colors"
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
                            <h2 className="text-3xl font-bold mb-3">Dine Oplysninger</h2>
                            <div className="inline-block bg-black/5 px-4 py-2 rounded-full text-sm text-gray-700 font-medium">
                                {booking.serviceName} • {selectedDate && format(selectedDate, 'd. MMM', { locale: da })} @ {booking.startTime}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Fulde Navn *</label>
                                <input
                                    type="text"
                                    value={booking.customerName}
                                    onChange={(e) => {
                                        setBooking(prev => ({ ...prev, customerName: e.target.value }))
                                        if (validationErrors.customerName) setValidationErrors(prev => ({ ...prev, customerName: undefined }))
                                    }}
                                    className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all ${
                                        validationErrors.customerName
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-white focus:border-black'
                                    }`}
                                    placeholder="Jens Hansen"
                                    autoFocus
                                />
                                {validationErrors.customerName && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                        <WarningIcon className="w-4 h-4 flex-shrink-0" />
                                        {validationErrors.customerName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Adresse *</label>
                                <input
                                    type="email"
                                    value={booking.customerEmail}
                                    onChange={(e) => {
                                        setBooking(prev => ({ ...prev, customerEmail: e.target.value }))
                                        if (validationErrors.customerEmail) setValidationErrors(prev => ({ ...prev, customerEmail: undefined }))
                                    }}
                                    className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all ${
                                        validationErrors.customerEmail
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-white focus:border-black'
                                    }`}
                                    placeholder="john@example.com"
                                />
                                {validationErrors.customerEmail && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                        <WarningIcon className="w-4 h-4 flex-shrink-0" />
                                        {validationErrors.customerEmail}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Telefonnummer <span className="font-normal text-gray-500">(Valgfrit)</span></label>
                                <input
                                    type="tel"
                                    value={booking.customerPhone}
                                    onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                                    placeholder="+45 12 34 56 78"
                                />
                            </div>

                            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                                    Jeg accepterer afbudspolitikken og bekræfter, at der ikke ydes refusion ved aflysning.
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-black hover:bg-gray-50 transition-all"
                            >
                                Tilbage
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                disabled={!agreedToTerms}
                                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
                            <h2 className="text-3xl font-bold mb-2">Gennemse Din Booking</h2>
                            <p className="text-gray-600">Tjek venligst at alle oplysninger er korrekte</p>
                        </div>

                        <div className="space-y-4">
                            {/* Service Details */}
                            <div className="bg-gradient-to-br from-black/5 to-black/3 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Behandling</h3>
                                <p className="text-lg font-bold text-black mb-2">{booking.serviceName}</p>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span className="font-medium">Varighed:</span>
                                    <span>{booking.serviceDuration} minutter</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700 mt-2">
                                    <span className="font-medium">Pris:</span>
                                    <span className="font-bold text-black">{booking.servicePrice} kr</span>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="bg-gradient-to-br from-black/5 to-black/3 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Tid</h3>
                                <div className="flex justify-between text-sm text-gray-700 mb-2">
                                    <span className="font-medium">Dato:</span>
                                    <span>{selectedDate && format(selectedDate, 'EEEE d. MMMM yyyy', { locale: da })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span className="font-medium">Tidspunkt:</span>
                                    <span className="font-bold text-black">{booking.startTime}</span>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="bg-gradient-to-br from-black/5 to-black/3 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Dine Oplysninger</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span className="font-medium">Navn:</span>
                                        <span>{booking.customerName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span className="font-medium">Email:</span>
                                        <span className="text-blue-600">{booking.customerEmail}</span>
                                    </div>
                                    {booking.customerPhone && (
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span className="font-medium">Phone:</span>
                                            <span>{booking.customerPhone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-black hover:bg-gray-50 transition-all"
                            >
                                Ret
                            </button>
                            <button
                                onClick={submitBooking}
                                disabled={loading}
                                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <SpinnerIcon className="w-4 h-4" />
                                        Bekræfter...
                                    </>
                                ) : (
                                    <>
                                        <CheckmarkIcon className="w-4 h-4" />
                                        Bekræft Tid
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === 4 && bookingResult && (
                    <div className="text-center animate-in zoom-in-95 duration-500 py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                            <CheckmarkIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Booking Bekræftet!</h2>
                        <p className="text-gray-600 mb-8">En bekræftelse er sendt til <span className="font-semibold">{booking.customerEmail}</span></p>

                        <div className="bg-gradient-to-br from-black/5 to-black/3 rounded-2xl p-6 mb-8 border border-gray-200 text-left space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Behandling</span>
                                <span className="font-bold text-black">{booking.serviceName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Dato & Tid</span>
                                <span className="font-bold text-black">{selectedDate && format(selectedDate, 'd. MMM', { locale: da })} kl. {booking.startTime}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                                <span className="text-gray-700 font-bold">Total</span>
                                <span className="text-2xl font-bold text-black">{booking.servicePrice} kr</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">Dit booking-nummer fremgår af bekræftelsesmailen.</p>

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
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            Book Ny Tid
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
