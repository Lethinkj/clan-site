import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a 24-hour "HH:MM" string to 12-hour "h:MM AM/PM" format.
export function formatTime12h(time24?: string | null): string {
  if (!time24) return ''
  const match = /^(\d{1,2}):(\d{2})/.exec(time24.trim())
  if (!match) return time24
  let hour = parseInt(match[1], 10)
  const minute = match[2]
  const period = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12
  if (hour === 0) hour = 12
  return `${hour}:${minute} ${period}`
}
