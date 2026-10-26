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
  parsePositiveStake,
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

interface PlacedReceipt {
  selection: StraightSelection
  stake: number
  winnings: number
}

interface StraightBetslipProps {
  selection: StraightSelection | null
  onClose: () => void
  onPlaced: (receipt: PlacedReceipt) => void
  onDismissSuccess: () => void
}

const ACCEPT_MS = 700

export function StraightBetslip({
  selection,
  onClose,
  onPlaced,
  onDismissSuccess,
}: StraightBetslipProps) {
  const reduceMotion = useReducedMotion()
  const stakeId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const placeToken = useRef(0)
  const [stakeText, setStakeText] = useState('')
  const [phase, setPhase] = useState<'edit' | 'pending' | 'success'>('edit')
  const [receipt, setReceipt] = useState<PlacedReceipt | null>(null)
  const phaseRef = useRef(phase)
  const dismissRef = useRef(onDismissSuccess)
  phaseRef.current = phase
  dismissRef.current = onDismissSuccess

  const stake = parsePositiveStake(stakeText)
  const winnings = selection && stake != null ? potentialWinnings(stake, selection.odds) : 0
  const risk = stake ?? 0
  const canPlace = phase === 'edit' && selection != null && stake != null

  useEffect(() => {
    placeToken.current += 1
    setPhase('edit')
    setStakeText('')
    setReceipt(null)
  }, [selection?.id])

  useEffect(() => {
    if (phase !== 'edit' || !selection) return
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [phase, selection?.id])

  useEffect(() => {
    return () => {
      placeToken.current += 1
      if (phaseRef.current === 'success') dismissRef.current()
    }
  }, [])

  function handleStakeChange(next: string) {
    const cleaned = next.replace(/[^0-9.]/g, '')
    if (cleaned === '' || /^\d*\.?\d{0,2}$/.test(cleaned)) {
      setStakeText(cleaned)
    }
  }

  function placeBet() {
    if (!selection || !canPlace || stake == null) return
    const snapshot: PlacedReceipt = {
      selection,
      stake,
      winnings: potentialWinnings(stake, selection.odds),
    }
    const token = ++placeToken.current
    setPhase('pending')
    window.setTimeout(() => {
      if (placeToken.current !== token) return
      setReceipt(snapshot)
      setPhase('success')
      onPlaced(snapshot)
    }, reduceMotion ? 0 : ACCEPT_MS)
  }

  return (
    <div
      data-testid="betslip"
      data-vaul-no-drag=""
      className="flex max-h-[min(640px,calc(100dvh-88px))] flex-col overflow-y-auto bg-white text-black"
    >
      <VaulDrawer.Title className="sr-only">Betslip</VaulDrawer.Title>
      <VaulDrawer.Description className="sr-only">
        Straight bet. Enter a stake to see risk and potential winnings, then place the bet.
      </VaulDrawer.Description>

      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
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
        {phase === 'success' && receipt ? (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            data-testid="bet-placed"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-4 px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2E7D32] text-white"
              >
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-black">Bet placed</p>
                <p className="text-sm text-black/70">Your straight bet was accepted.</p>
              </div>
            </div>
            <ReceiptDetails
              selection={receipt.selection}
              risk={receipt.stake}
              winnings={receipt.winnings}
              reduceMotion={!!reduceMotion}
            />
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
            key={selection?.id ?? 'empty'}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-4 px-4 py-4"
            onSubmit={(event) => {
              event.preventDefault()
              placeBet()
            }}
          >
            {selection ? (
              <SelectionDetails selection={selection} />
            ) : (
              <p className="text-sm text-black/70">Choose a price to add a selection.</p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor={stakeId} className="text-sm font-medium text-black">
                Stake
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-black/50">
                  $
                </span>
                <Input
                  ref={inputRef}
                  id={stakeId}
                  data-testid="stake-input"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  enterKeyHint="done"
                  value={stakeText}
                  placeholder="0.00"
                  disabled={!selection || phase === 'pending'}
                  onChange={(event) => handleStakeChange(event.target.value)}
                  className="h-12 border-black/20 bg-white pl-7 text-base text-black tabular-nums placeholder:text-black/35 focus-visible:ring-[#2E7D32] md:text-base"
                />
              </div>
            </div>

            <dl className="grid grid-cols-[minmax(0,1fr)_8.5rem] items-baseline gap-x-3 gap-y-2 border-t border-black/10 pt-3">
              <dt className="text-sm font-medium text-black">Risk</dt>
              <dd className="text-right">
                <MoneyFigure testId="risk-amount" value={risk} reduceMotion={!!reduceMotion} />
              </dd>
              <dt className="text-sm font-medium text-black">Potential winnings</dt>
              <dd className="text-right">
                <MoneyFigure
                  testId="potential-winnings"
                  value={winnings}
                  reduceMotion={!!reduceMotion}
                />
              </dd>
            </dl>

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
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function SelectionDetails({ selection }: { selection: StraightSelection }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-black/55">Selection</p>
        <p data-testid="bet-selection" className="truncate text-base font-semibold text-black">
          {selection.selection}
        </p>
        <p className="truncate text-sm text-black/70">{selection.marketTitle}</p>
        <p className="truncate text-sm text-black/60">{selection.eventName}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium uppercase tracking-wide text-black/55">Odds</p>
        <p data-testid="bet-odds" className="text-base font-semibold tabular-nums text-black">
          {selection.odds}
        </p>
      </div>
    </div>
  )
}

function ReceiptDetails({
  selection,
  risk,
  winnings,
  reduceMotion,
}: {
  selection: StraightSelection
  risk: number
  winnings: number
  reduceMotion: boolean
}) {
  return (
    <dl className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-x-3 gap-y-2">
      <dt className="text-sm font-medium text-black">Selection</dt>
      <dd data-testid="receipt-selection" className="truncate text-right text-sm font-semibold text-black">
        {selection.selection}
      </dd>
      <dt className="text-sm font-medium text-black">Odds</dt>
      <dd data-testid="receipt-odds" className="text-right text-sm font-semibold tabular-nums text-black">
        {selection.odds}
      </dd>
      <dt className="text-sm font-medium text-black">Risk</dt>
      <dd className="text-right">
        <MoneyFigure testId="receipt-risk" value={risk} reduceMotion={reduceMotion} />
      </dd>
      <dt className="text-sm font-medium text-black">Potential winnings</dt>
      <dd className="text-right">
        <MoneyFigure testId="receipt-winnings" value={winnings} reduceMotion={reduceMotion} />
      </dd>
    </dl>
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
      className="inline-flex h-5 min-w-[6.75rem] items-center justify-end overflow-hidden text-sm font-semibold tabular-nums text-black"
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
