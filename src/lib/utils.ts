import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtINR(val: number): string {
  return `₹${Math.abs(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function fmtPct(val: number): string {
  const sign = val >= 0 ? '+' : ''
  return `${sign}${val.toFixed(2)}%`
}
