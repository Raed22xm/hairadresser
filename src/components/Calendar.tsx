/**
 * Calendar Component
 * 
 * A custom calendar component showing the full month.
 * Allows users to select a date visually.
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
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-black transition-colors"
                    disabled={isSameMonth(currentMonth, new Date())}
                >
                    ←
                </button>
                <h3 className="text-lg font-semibold text-black capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: da })}
                </h3>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-black transition-colors"
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
            <div className="grid grid-cols-7 mb-2">
                {days.map((day) => (
                    <div key={day} className="text-center text-sm text-gray-500 py-2">
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
              ${!isCurrentMonth ? 'text-gray-300' : ''}
              ${isDisabled && isCurrentMonth ? 'text-gray-300 cursor-not-allowed opacity-50' : ''}
              ${isCurrentMonth && !isDisabled && !isSelected ? 'text-black hover:bg-black/5 hover:scale-105' : ''}
              ${isSelected ? 'bg-black text-white shadow-md scale-105' : ''}
              ${isToday && !isSelected ? 'ring-2 ring-black' : ''}
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded ring-2 ring-black"></div>
                    <span>I dag</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-black"></div>
                    <span>Valgt</span>
                </div>
            </div>
        </div>
    )
}
