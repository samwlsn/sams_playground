/** Round to cents so the slip, the button, and the receipt show the same figure. */
export function roundCents(amount: number): number {
  if (!Number.isFinite(amount)) return 0
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

/**
 * Profit only (stake is not included).
 * American odds are strings with a leading + or - (the lobby default).
 * Unsigned numbers are decimal odds: profit = stake * (odds - 1).
 * Fractional strings such as 5/2 are profit = stake * (numerator / denominator).
 */
export function potentialWinnings(stake: number, odds: string): number {
  if (!Number.isFinite(stake) || stake <= 0) return 0
  const raw = odds.trim()

  const fractional = raw.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (fractional) {
    const denominator = Number(fractional[2])
    if (denominator <= 0) return 0
    return roundCents(stake * (Number(fractional[1]) / denominator))
  }

  if (raw.startsWith('+') || raw.startsWith('-')) {
    const american = Number(raw)
    if (!Number.isFinite(american) || american === 0) return 0
    const profit =
      american > 0 ? stake * (american / 100) : stake * (100 / Math.abs(american))
    return roundCents(profit)
  }

  const decimal = Number(raw)
  if (!Number.isFinite(decimal)) return 0
  return roundCents(stake * (decimal - 1))
}

export function formatMoney(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return safe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Decimal multiplier for one price. American odds use a leading + or -. */
export function oddsToDecimal(odds: string): number {
  const raw = odds.trim()
  const fractional = raw.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (fractional) {
    const denominator = Number(fractional[2])
    if (denominator <= 0) return 1
    return Number(fractional[1]) / denominator + 1
  }
  if (raw.startsWith('+') || raw.startsWith('-')) {
    const american = Number(raw)
    if (!Number.isFinite(american) || american === 0) return 1
    if (american > 0) return american / 100 + 1
    return 100 / Math.abs(american) + 1
  }
  const decimal = Number(raw)
  if (!Number.isFinite(decimal) || decimal <= 0) return 1
  return decimal
}

/** Combined decimal price for a parlay. Profit uses this minus 1. */
export function parlayDecimal(oddsList: string[]): number {
  if (oddsList.length === 0) return 1
  return oddsList.reduce((product, odds) => product * oddsToDecimal(odds), 1)
}

export function parlayWinnings(stake: number, oddsList: string[]): number {
  if (!Number.isFinite(stake) || stake <= 0 || oddsList.length < 2) return 0
  return roundCents(stake * (parlayDecimal(oddsList) - 1))
}

export function formatParlayOdds(oddsList: string[]): string {
  const decimal = parlayDecimal(oddsList)
  const allDecimal = oddsList.every((odds) => {
    const raw = odds.trim()
    return !raw.startsWith('+') && !raw.startsWith('-') && !raw.includes('/')
  })
  if (allDecimal) return decimal.toFixed(2)
  if (!Number.isFinite(decimal) || decimal <= 1) return '+0'
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`
  return `-${Math.round(100 / (decimal - 1))}`
}

/** A placeable stake is a positive number with at most two decimal places. */
export function parsePositiveStake(text: string): number | null {
  const trimmed = text.trim()
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return null
  if (trimmed.endsWith('.')) return null
  const decimals = trimmed.split('.')[1]
  if (decimals && decimals.length > 2) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value) || value <= 0) return null
  return roundCents(value)
}
