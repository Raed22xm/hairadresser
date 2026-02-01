'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'

export interface Service {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: string
}

export interface BookingData {
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

export interface ValidationErrors {
  customerName?: string
  customerEmail?: string
}

const INITIAL_BOOKING: BookingData = {
  serviceId: '',
  serviceName: '',
  servicePrice: '',
  serviceDuration: 0,
  date: '',
  startTime: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

interface BookingWizardContextValue {
  step: number
  services: Service[]
  availableSlots: string[]
  loading: boolean
  error: string | null
  booking: BookingData
  bookingResult: Record<string, unknown> | null
  selectedDate: Date | null
  validationErrors: ValidationErrors
  agreedToTerms: boolean

  setStep: (step: number) => void
  setBooking: React.Dispatch<React.SetStateAction<BookingData>>
  setSelectedDate: (date: Date | null) => void
  setAvailableSlots: (slots: string[]) => void
  setAgreedToTerms: (agreed: boolean) => void
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setError: (error: string | null) => void

  selectService: (service: Service) => void
  handleDateSelect: (date: Date) => void
  selectTime: (time: string) => void
  validateForm: () => boolean
  submitBooking: () => Promise<void>
  resetWizard: () => void
}

const BookingWizardContext = createContext<BookingWizardContextValue | null>(null)

export function BookingWizardProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service')

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
    ...INITIAL_BOOKING,
    serviceId: preselectedService || '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

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

  const resetWizard = useCallback(() => {
    setStep(1)
    setBooking(INITIAL_BOOKING)
    setBookingResult(null)
    setAgreedToTerms(false)
    setSelectedDate(null)
    setAvailableSlots([])
    setError(null)
    setValidationErrors({})
  }, [])

  return (
    <BookingWizardContext.Provider value={{
      step, services, availableSlots, loading, error, booking,
      bookingResult, selectedDate, validationErrors, agreedToTerms,
      setStep, setBooking, setSelectedDate, setAvailableSlots,
      setAgreedToTerms, setValidationErrors, setError,
      selectService, handleDateSelect, selectTime, validateForm,
      submitBooking, resetWizard,
    }}>
      {children}
    </BookingWizardContext.Provider>
  )
}

export function useBookingWizard(): BookingWizardContextValue {
  const context = useContext(BookingWizardContext)
  if (!context) {
    throw new Error('useBookingWizard must be used within a BookingWizardProvider')
  }
  return context
}
