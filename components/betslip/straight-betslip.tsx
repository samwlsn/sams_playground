'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { Drawer as VaulDrawer } from 'vaul'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  formatMoney,
  formatParlayOdds,
  parsePositiveStake,
  parlayWinnings,
  potentialWinnings,
} from '@/lib/betting/potential-winnings'
import { cn } from '@/lib/utils'

export interface StraightSelection {
  id: string
  eventId: number
  eventName: string
  marketTitle: string
  selection: string
  odds: string
}

export interface PlacedLeg {
  kind: 'straight' | 'parlay'
  label: string
  odds: string
  stake: number
  winnings: number
  selection?: StraightSelection
}

interface StraightBetslipProps {
  selections: StraightSelection[]
  onClose: () => void
  onRemove: (id: string) => void
  onPlaced: (legs: PlacedLeg[]) => void
  onDismissSuccess: () => void
}

const ACCEPT_MS = 700

export function StraightBetslip({
  selections,
  onClose,
  onRemove,
  onPlaced,
  onDismissSuccess,
}: StraightBetslipProps) {
  const reduceMotion = useReducedMotion()
  const formId = useId()
  const placeToken = useRef(0)
  const [stakes, setStakes] = useState<Record<string, string>>({})
  const [parlayText, setParlayText] = useState('')
  const [phase, setPhase] = useState<'edit' | 'pending' | 'success'>('edit')
  const [receipt, setReceipt] = useState<PlacedLeg[]>([])
  const phaseRef = useRef(phase)
  const dismissRef = useRef(onDismissSuccess)
  phaseRef.current = phase
  dismissRef.current = onDismissSuccess

  const eventCount = new Set(selections.map((selection) => selection.eventId)).size
  const showParlay = selections.length >= 2 && eventCount >= 2
  const parlayOdds = showParlay ? formatParlayOdds(selections.map((selection) => selection.odds)) : ''
  const parlayStake = showParlay ? parsePositiveStake(parlayText) : null
  const parlayProfit = parlayStake != null ? parlayWinnings(parlayStake, selections.map((selection) => selection.odds)) : 0

  const straightLegs = selections.map((selection) => {
    const stake = parsePositiveStake(stakes[selection.id] ?? '')
    return {
      selection,
      stake,
      winnings: stake != null ? potentialWinnings(stake, selection.odds) : 0,
    }
  })
  const canPlace =
    phase === 'edit' &&
    (straightLegs.some((leg) => leg.stake != null) || parlayStake != null)

  const selectionKey = selections.map((selection) => selection.id).join('|')

  useEffect(() => {
    setStakes((prev) => {
      const ids = new Set(selections.map((selection) => selection.id))
      const next: Record<string, string> = {}
      let changed = false
      for (const [id, value] of Object.entries(prev)) {
        if (ids.has(id)) next[id] = value
        else changed = true
      }
      if (Object.keys(next).length !== Object.keys(prev).length) changed = true
      return changed ? next : prev
    })
    if (!showParlay) setParlayText('')
  }, [selectionKey, showParlay, selections])

  const focusedKey = useRef('')
  useEffect(() => {
    if (phase !== 'edit' || selections.length === 0) return
    const newest = selections[selections.length - 1]
    const frame = window.requestAnimationFrame(() => {
      if (focusedKey.current === selectionKey) return
      focusedKey.current = selectionKey
      document.getElementById(`${formId}-${newest.id}`)?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [selectionKey, phase, formId, selections])

  useEffect(() => {
    return () => {
      placeToken.current += 1
      if (phaseRef.current === 'success') dismissRef.current()
    }
  }, [])

  function setStake(id: string, next: string) {
    const cleaned = next.replace(/[^0-9.]/g, '')
    if (cleaned === '' || /^\d*\.?\d{0,2}$/.test(cleaned)) {
      setStakes((prev) => ({ ...prev, [id]: cleaned }))
    }
  }

  function setParlayStake(next: string) {
    const cleaned = next.replace(/[^0-9.]/g, '')
    if (cleaned === '' || /^\d*\.?\d{0,2}$/.test(cleaned)) setParlayText(cleaned)
  }

  function placeBet() {
    if (!canPlace) return
    const legs: PlacedLeg[] = []
    for (const leg of straightLegs) {
      if (leg.stake == null) continue
      legs.push({
        kind: 'straight',
        label: leg.selection.selection,
        odds: leg.selection.odds,
        stake: leg.stake,
        winnings: potentialWinnings(leg.stake, leg.selection.odds),
        selection: leg.selection,
      })
    }
    if (showParlay && parlayStake != null) {
      legs.push({
        kind: 'parlay',
        label: `${selections.length}-leg parlay`,
        odds: parlayOdds,
        stake: parlayStake,
        winnings: parlayWinnings(parlayStake, selections.map((selection) => selection.odds)),
      })
    }
    if (legs.length === 0) return
    const token = ++placeToken.current
    setPhase('pending')
    window.setTimeout(() => {
      if (placeToken.current !== token) return
      setReceipt(legs)
      setPhase('success')
      onPlaced(legs)
    }, reduceMotion ? 0 : ACCEPT_MS)
  }

  return (
    <div
      data-testid="betslip"
      data-vaul-no-drag=""
      className="flex max-h-[min(640px,calc(100dvh-88px))] flex-col overflow-hidden bg-white text-black"
    >
      <VaulDrawer.Title className="sr-only">Betslip</VaulDrawer.Title>
      <VaulDrawer.Description className="sr-only">
        Straight bets and a parlay. Enter a risk amount beside each selection.
      </VaulDrawer.Description>

      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3">
        <h2 className="text-base font-semibold text-black">Betslip</h2>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={phase === 'success' ? 'Dismiss bet confirmation' : 'Close betslip'}
          onClick={phase === 'success' ? onDismissSuccess : onClose}
          className="h-11 w-11 shrink-0 border-black/15 bg-white text-black hover:bg-black/5"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {phase === 'success' && receipt.length > 0 ? (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            data-testid="bet-placed"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white"
              >
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-black">Bet placed</p>
                <p className="text-sm text-black/70">
                  {receipt.length === 1 ? 'Your bet was accepted.' : `${receipt.length} bets were accepted.`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {receipt.map((leg, index) => (
                <div
                  key={`${leg.kind}-${leg.label}-${index}`}
                  data-testid={leg.kind === 'parlay' ? 'receipt-parlay' : 'receipt-straight'}
                  className="rounded-md border border-black/10 px-3 py-2"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-black/55">
                    {leg.kind === 'parlay' ? 'Parlay' : 'Selection'}
                  </p>
                  <p className="truncate text-sm font-semibold text-black">{leg.label}</p>
                  <p className="text-sm text-black/70">Odds {leg.odds}</p>
                  <p className="text-sm text-black">Risk ${formatMoney(leg.stake)}</p>
                  <p className="text-sm text-black">Potential winnings ${formatMoney(leg.winnings)}</p>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={onDismissSuccess}
              className="h-12 w-full bg-[#2E7D32] text-base font-semibold text-white hover:bg-[#256628]"
            >
              Done
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="editor"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault()
              placeBet()
            }}
          >
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
            {selections.length === 0 ? (
              <p className="text-sm text-black/70">Choose a price to add a selection.</p>
            ) : (
              <section className="flex flex-col gap-3" data-testid="selections-section">
                {showParlay && (
                  <h3 className="text-xs font-medium uppercase tracking-wide text-black/55">Selections</h3>
                )}
                <AnimatePresence initial={false}>
                  {straightLegs.map((leg) => (
                    <SelectionRow
                      key={leg.selection.id}
                      selection={leg.selection}
                      stakeText={stakes[leg.selection.id] ?? ''}
                      winnings={leg.winnings}
                      inputId={`${formId}-${leg.selection.id}`}
                      disabled={phase === 'pending'}
                      reduceMotion={!!reduceMotion}
                      onChange={(value) => setStake(leg.selection.id, value)}
                      onRemove={() => onRemove(leg.selection.id)}
                    />
                  ))}
                </AnimatePresence>
              </section>
            )}

            <AnimatePresence initial={false}>
              {showParlay && (
                <motion.section
                  key="parlay"
                  data-testid="parlay-section"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="rounded-md border border-black/10 bg-black/[0.03] p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-medium uppercase tracking-wide text-black/55">Parlay</h3>
                      <p className="text-sm text-black">
                        Odds <span data-testid="parlay-odds" className="font-semibold tabular-nums">{parlayOdds}</span>
                      </p>
                      <p className="text-sm text-black">
                        To win{' '}
                        <MoneyFigure testId="parlay-winnings" value={parlayProfit} reduceMotion={!!reduceMotion} />
                      </p>
                    </div>
                    <RiskField
                      id={`${formId}-parlay`}
                      testId="parlay-risk-input"
                      value={parlayText}
                      disabled={phase === 'pending'}
                      onChange={setParlayStake}
                    />
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            </div>
            <div className="shrink-0 border-t border-black/10 px-4 py-3">
              <Button
                type="submit"
                data-testid="place-bet"
                disabled={phase === 'pending' || !canPlace}
                className={cn(
                  'h-12 w-full text-base font-semibold disabled:opacity-100',
                  phase === 'pending' || canPlace
                    ? 'bg-[#2E7D32] text-white hover:bg-[#256628]'
                    : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {phase === 'pending' ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 motion-safe:animate-spin" />
                    Placing bet…
                  </span>
                ) : (
                  'Place bet'
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function SelectionRow({
  selection,
  stakeText,
  winnings,
  inputId,
  disabled,
  reduceMotion,
  onChange,
  onRemove,
}: {
  selection: StraightSelection
  stakeText: string
  winnings: number
  inputId: string
  disabled: boolean
  reduceMotion: boolean
  onChange: (value: string) => void
  onRemove: () => void
}) {
  return (
    <motion.div
      layout={reduceMotion ? false : 'position'}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
      className="flex items-start gap-2 border-b border-black/5 pb-3 last:border-b-0 last:pb-0"
      data-testid="selection-row"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={`Remove ${selection.selection}`}
        onClick={onRemove}
        className="mt-0.5 h-11 w-11 shrink-0 border-black/15 bg-white text-black hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-black/55">Selection</p>
        <p data-testid="bet-selection" className="truncate text-sm font-semibold text-black">
          {selection.selection}
        </p>
        <p className="truncate text-sm text-black/70">
          {selection.marketTitle} · <span data-testid="bet-odds" className="tabular-nums">{selection.odds}</span>
        </p>
        <p className="truncate text-sm text-black/60">{selection.eventName}</p>
        <p className="text-sm text-black">
          To win <MoneyFigure testId="potential-winnings" value={winnings} reduceMotion={reduceMotion} />
        </p>
      </div>
      <RiskField
        id={inputId}
        testId="stake-input"
        value={stakeText}
        disabled={disabled}
        onChange={onChange}
      />
    </motion.div>
  )
}

function RiskField({
  id,
  testId,
  value,
  disabled,
  onChange,
}: {
  id: string
  testId: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="w-[104px] shrink-0">
      <Label htmlFor={id} className="mb-1 block text-right text-xs font-medium text-black">
        Risk
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-black/50">
          $
        </span>
        <Input
          id={id}
          data-testid={testId}
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="done"
          value={value}
          placeholder="0.00"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 border-black/20 bg-white pl-5 pr-2 text-right text-base text-black tabular-nums placeholder:text-black/35 focus-visible:ring-[#2E7D32] md:text-base"
        />
      </div>
    </div>
  )
}

function MoneyFigure({
  value,
  testId,
  reduceMotion,
}: {
  value: number
  testId: string
  reduceMotion: boolean
}) {
  return (
    <span
      data-testid={testId}
      data-value={value.toFixed(2)}
      className="inline-flex h-5 min-w-[4.5rem] items-center overflow-hidden align-bottom text-sm font-semibold tabular-nums text-black"
    >
      <motion.span
        key={value.toFixed(2)}
        initial={reduceMotion ? false : { y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.4, 0, 0.2, 1] }}
      >
        ${formatMoney(value)}
      </motion.span>
    </span>
  )
}
