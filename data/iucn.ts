import type { IucnCode } from '~/types/species'

/**
 * Shared IUCN Red List palette and labels, used by the population charts,
 * status badges, and anywhere a conservation status is shown. One source of
 * truth so the colours stay consistent across the site.
 */
export const iucnMeta: Record<IucnCode, { label: string; short: string; color: string }> = {
  LC: { label: 'Least Concern', short: 'LC', color: '#34d399' },
  NT: { label: 'Near Threatened', short: 'NT', color: '#a3e635' },
  VU: { label: 'Vulnerable', short: 'VU', color: '#fbbf24' },
  EN: { label: 'Endangered', short: 'EN', color: '#fb7185' },
  CR: { label: 'Critically Endangered', short: 'CR', color: '#f43f5e' },
  DD: { label: 'Data Deficient', short: 'DD', color: '#94a3b8' },
}

export const iucnColor = (code: IucnCode) => iucnMeta[code].color

/**
 * Derive a Red List code from a free-text status string. Reads only the leading
 * status (before any parenthetical caveat), so
 * "Least Concern (Western population Critically Endangered)" resolves to LC.
 */
export function iucnFromStatus(status: string): IucnCode {
  const s = status.split('(')[0].toLowerCase()
  if (s.includes('critically')) return 'CR'
  if (s.includes('endangered')) return 'EN'
  if (s.includes('vulnerable')) return 'VU'
  if (s.includes('near threatened')) return 'NT'
  if (s.includes('data deficient')) return 'DD'
  return 'LC'
}
