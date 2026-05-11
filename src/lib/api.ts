const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export function api(path: string): string {
  return `${BASE}${path}`
}
