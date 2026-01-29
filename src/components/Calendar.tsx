/**
 * Calendar Component
 * 
 * A custom calendar component showing the full month.
 * Allows users to select a date visually.
 * Updated for Luxury Dark Theme.
 * 
 * @module components/Calendar
 */

'use client'

import { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isBefore,
    isAfter
} from 'date-fns'
import { da } from 'date-fns/locale'

interface CalendarProps {
    selectedDate: Date | null
    onSelectDate: (date: Date) => void
    minDate?: Date
    maxDate?: Date
    disabledDays?: number[] // 0 = Sunday, 6 = Saturday
}

/**
 * Calendar component showing a full month view
 */
export default function Calendar({
    selectedDate,
    onSelectDate,
    minDate = new Date(),
    maxDate,
    disabledDays = [0], // Sunday disabled by default
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    /**
     * Renders the header with month navigation
     */
    function renderHeader() {
        return (
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    disabled={isSameMonth(currentMonth, new Date())}
                >
                    ←
                </button>
                <h3 className="text-lg font-serif font-medium text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: da })}
                </h3>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    →
                </button>
            </div>
        )
    }

    /**
     * Renders the weekday headers
     */
    function renderDaysOfWeek() {
        const days = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
        return (
            <div className="grid grid-cols-7 mb-3">
                {days.map((day) => (
                    <div key={day} className="text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#D4AF37] py-2">
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    /**
     * Renders the calendar grid
     */
    function renderCells() {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }) // Monday start

        const rows = []
        let days = []
        let day = startDate

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const currentDay = day
                const dayOfWeek = currentDay.getDay()

                // Check if day is disabled
                const isDisabledDay = disabledDays.includes(dayOfWeek)
                const isPast = isBefore(currentDay, minDate) && !isSameDay(currentDay, minDate)
                const isFuture = maxDate && isAfter(currentDay, maxDate)
                const isCurrentMonth = isSameMonth(currentDay, monthStart)
                const isSelected = selectedDate && isSameDay(currentDay, selectedDate)
                const isToday = isSameDay(currentDay, new Date())
                const isDisabled = !isCurrentMonth || isPast || isFuture || isDisabledDay

                days.push(
                    <button
                        key={currentDay.toString()}
                        onClick={() => !isDisabled && onSelectDate(currentDay)}
                        disabled={isDisabled}
                        className={`
              aspect-square flex items-center justify-center rounded-lg text-sm font-medium
              transition-all
              ${!isCurrentMonth ? 'text-white/10' : ''}
              ${isDisabled && isCurrentMonth ? 'text-white/20 cursor-not-allowed' : ''}
              ${isCurrentMonth && !isDisabled && !isSelected ? 'text-white hover:bg-white/10 hover:text-[#D4AF37] hover:scale-105' : ''}
              ${isSelected ? 'bg-[#D4AF37] text-black shadow-lg scale-105 font-bold' : ''}
              ${isToday && !isSelected ? 'ring-1 ring-[#D4AF37]/50 text-[#D4AF37]' : ''}
            `}
                    >
                        {format(currentDay, 'd')}
                    </button>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            )
            days = []
        }

        return <div className="space-y-1">{rows}</div>
    }

    return (
        <div className="bg-transparent">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full ring-1 ring-[#D4AF37]"></div>
                    <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                    <span>Selected</span>
                </div>
            </div>
        </div>
    )
}
