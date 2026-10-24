import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Delete, Lightbulb, PartyPopper, RotateCcw, TicketPercent } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { easeOut, springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
  ANSWER,
  MAX_TRIES,
  STATE_LABEL,
  WORD_LENGTH,
  evaluateGuess,
  letterStates,
  type TileState,
} from "@/lib/wordle"

interface WordleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWin: () => void
}

export function WordleDialog({ open, onOpenChange, onWin }: WordleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Focus the dialog itself (not the first key) so typing and Enter work immediately.
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          ;(event.currentTarget as HTMLElement).focus()
        }}
        className="aero-glass max-h-[calc(100dvh-1rem)] gap-0 overflow-y-auto overscroll-contain border-0 p-5 short:p-4 sm:max-w-[30rem] sm:p-7 short:sm:p-5"
        style={{
          background:
            "radial-gradient(90% 45% at 10% 0%, rgb(255 255 255 / 0.9), transparent 70%), linear-gradient(180deg, rgb(244 253 255 / 0.96), rgb(214 245 255 / 0.94) 60%, rgb(200 245 236 / 0.94))",
        }}
      >
        {/* Mounted only while open, so each opening starts a fresh game */}
        <WordleGame onWin={onWin} />
      </DialogContent>
    </Dialog>
  )
}

type Status = "playing" | "revealing" | "won" | "lost"

const FLIP_STAGGER = 0.22
const FLIP_DURATION = 0.5
const REVEAL_MS = ((WORD_LENGTH - 1) * FLIP_STAGGER + FLIP_DURATION) * 1000 + 150

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "+ZXCVBNM-"]

function WordleGame({ onWin }: { onWin: () => void }) {
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState("")
  const [status, setStatus] = useState<Status>("playing")
  const [revealed, setRevealed] = useState(0)
  const [shake, setShake] = useState(0)
  const [message, setMessage] = useState("")
  const [showHint, setShowHint] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const type = useCallback(
    (letter: string) => {
      if (status !== "playing") return
      setMessage("")
      setCurrent((c) => (c.length < WORD_LENGTH ? c + letter : c))
    },
    [status]
  )

  const erase = useCallback(() => {
    if (status !== "playing") return
    setCurrent((c) => c.slice(0, -1))
  }, [status])

  const submit = useCallback(() => {
    if (status !== "playing") return
    if (current.length < WORD_LENGTH) {
      setMessage(`Enter all ${WORD_LENGTH} letters`)
      setShake((n) => n + 1)
      return
    }
    const guess = current
    const next = [...guesses, guess]
    const result = evaluateGuess(guess)
    setGuesses(next)
    setCurrent("")
    setStatus("revealing")
    setMessage(
      `${guess.split("").map((l, i) => `${l} ${STATE_LABEL[result[i]]}`).join(", ")}.`
    )
    timer.current = window.setTimeout(() => {
      setRevealed(next.length)
      if (guess === ANSWER) {
        setStatus("won")
        onWin()
      } else if (next.length >= MAX_TRIES) {
        setStatus("lost")
      } else {
        const left = MAX_TRIES - next.length
        setStatus("playing")
        setMessage(`${left} ${left === 1 ? "try" : "tries"} left`)
      }
    }, REVEAL_MS)
  }, [current, guesses, status, onWin])

  const reset = () => {
    window.clearTimeout(timer.current)
    setGuesses([])
    setCurrent("")
    setRevealed(0)
    setStatus("playing")
    setMessage("")
  }

  // Physical keyboard support
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (event.key === "Enter") {
        // Other buttons (close, hint, panels) keep their own Enter behaviour;
        // on the game keyboard, Enter always means "submit the guess".
        if (target?.closest("button") && !target.closest("[data-wordle-key]")) return
        event.preventDefault()
        submit()
      } else if (event.key === "Backspace") {
        event.preventDefault()
        erase()
      } else if (/^[a-z]$/i.test(event.key)) {
        type(event.key.toUpperCase())
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [submit, erase, type])

  const keyStates = letterStates(guesses.slice(0, revealed))
  const finished = status === "won" || status === "lost"

  return (
    <>
      <DialogHeader className="items-center pr-0 text-center">
        <span className="aero-gel aero-gel--green grid size-14 place-items-center rounded-full short:hidden">
          <TicketPercent className="size-7" aria-hidden="true" />
        </span>
        <DialogTitle className="mt-3 text-[1.9rem] short:mt-0 short:text-[1.6rem] leading-none font-extrabold tracking-tight text-deep">
          Avail discount
        </DialogTitle>
        <DialogDescription className="mt-1 max-w-[30ch] text-[1rem] leading-snug text-deep-soft short:text-[0.92rem]">
          Guess the {WORD_LENGTH}-letter word in {MAX_TRIES} tries. Get it and today&rsquo;s
          bill is on the house.
        </DialogDescription>
      </DialogHeader>

      <AnimatePresence mode="wait" initial={false}>
        {status === "won" ? (
          <WinPanel key="won" />
        ) : status === "lost" ? (
          <LostPanel key="lost" onRetry={reset} />
        ) : (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
            className="flex flex-col items-center"
          >
            <Legend />

            <div className="mt-4 flex flex-col gap-2 short:mt-3 short:gap-1.5" role="group" aria-label="Guesses">
              {Array.from({ length: MAX_TRIES }, (_, row) => {
                const submitted = guesses[row]
                const isCurrent = row === guesses.length && !finished
                const letters = submitted ?? (isCurrent ? current : "")
                const states = submitted ? evaluateGuess(submitted) : null
                return (
                  <motion.div
                    key={isCurrent ? `row-${row}-${shake}` : `row-${row}`}
                    initial={{ x: 0 }}
                    animate={isCurrent && shake ? { x: [0, -10, 10, -7, 7, -3, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-2 short:gap-1.5"
                    aria-label={
                      submitted
                        ? `Guess ${row + 1}: ${submitted
                            .split("")
                            .map((l, i) => `${l} ${STATE_LABEL[states![i]]}`)
                            .join(", ")}`
                        : `Guess ${row + 1}, ${isCurrent ? `${letters.length} of ${WORD_LENGTH} letters` : "empty"}`
                    }
                    role="img"
                  >
                    {Array.from({ length: WORD_LENGTH }, (_, col) => (
                      <Tile
                        key={col}
                        letter={letters[col] ?? ""}
                        state={states?.[col]}
                        delay={col * FLIP_STAGGER}
                      />
                    ))}
                  </motion.div>
                )
              })}
            </div>

            <p className="mt-3 min-h-6 short:mt-1.5 text-center text-[0.95rem] font-semibold text-ocean-ink" role="status" aria-live="polite">
              {message}
            </p>

            <Keyboard states={keyStates} onLetter={type} onEnter={submit} onErase={erase} disabled={status !== "playing"} />

            <div className="mt-4 flex min-h-11 flex-col items-center short:mt-1.5">
              {showHint ? (
                <p className="aero-chip flex items-center gap-2 rounded-full px-4 py-2 text-[0.92rem] font-medium text-deep">
                  <Lightbulb className="size-4 text-ocean-ink" aria-hidden="true" />
                  It&rsquo;s the name of the style this site is designed in.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold text-ocean-ink underline decoration-ocean/40 underline-offset-4 hover:text-deep"
                >
                  <Lightbulb className="size-4" aria-hidden="true" />
                  Need a hint?
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const tileTone: Record<TileState, string> = {
  correct: "wordle-correct",
  present: "wordle-present",
  absent: "wordle-absent",
}

function Tile({ letter, state, delay }: { letter: string; state?: TileState; delay: number }) {
  return (
    <motion.div
      className={cn(
        "wordle-tile relative grid size-[3.6rem] place-items-center rounded-[1rem] font-heading text-[1.9rem] leading-none font-extrabold text-deep sm:size-16 short:size-[3.1rem] short:text-[1.6rem] short:sm:size-[3.25rem]",
        letter && !state && "wordle-filled"
      )}
      initial={false}
      animate={state ? { rotateX: [0, 90, 0] } : { rotateX: 0 }}
      transition={{ duration: FLIP_DURATION, delay, ease: "easeInOut" }}
      style={{ transformPerspective: 400 }}
    >
      {state && (
        <motion.span
          aria-hidden="true"
          className={cn("absolute inset-0 rounded-[inherit]", tileTone[state])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0, delay: delay + FLIP_DURATION / 2 }}
        />
      )}
      <AnimatePresence initial={false}>
        {letter && (
          <motion.span
            key={letter}
            className="relative"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.1 } }}
            transition={springSnappy}
          >
            {letter}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Legend() {
  const items: [TileState, string, string][] = [
    ["correct", "A", "Right spot"],
    ["present", "E", "Wrong spot"],
    ["absent", "Z", "Not in word"],
  ]
  return (
    <ul className="mt-5 short:mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[0.85rem] font-medium text-deep-soft">
      {items.map(([state, letter, label]) => (
        <li key={state} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("grid size-6 place-items-center rounded-md font-heading text-[0.8rem] font-extrabold text-deep", tileTone[state])}
          >
            {letter}
          </span>
          {label}
        </li>
      ))}
    </ul>
  )
}

function Keyboard({
  states,
  onLetter,
  onEnter,
  onErase,
  disabled,
}: {
  states: Map<string, TileState>
  onLetter: (l: string) => void
  onEnter: () => void
  onErase: () => void
  disabled: boolean
}) {
  return (
    <div className="mt-2 flex w-full flex-col gap-1.5" aria-label="Keyboard" role="group">
      {KEY_ROWS.map((row, r) => (
        <div key={r} className="flex justify-center gap-1.5">
          {row.split("").map((key) => {
            if (key === "+")
              return (
                <button key="enter" data-wordle-key type="button" disabled={disabled} onClick={onEnter} className="wordle-key h-12 short:h-11 flex-[1.6] px-1 text-[0.8rem] font-bold">
                  Enter
                </button>
              )
            if (key === "-")
              return (
                <button key="erase" data-wordle-key type="button" disabled={disabled} onClick={onErase} className="wordle-key grid h-12 short:h-11 flex-[1.4] place-items-center" aria-label="Delete letter">
                  <Delete className="size-5" aria-hidden="true" />
                </button>
              )
            const state = states.get(key)
            return (
              <button
                key={key}
                data-wordle-key
                type="button"
                disabled={disabled}
                onClick={() => onLetter(key)}
                aria-label={state ? `${key}, ${STATE_LABEL[state]}` : key}
                className={cn("wordle-key h-12 short:h-11 min-w-0 flex-1 font-heading text-[1.05rem] font-bold", state && tileTone[state])}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function WinPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="mt-6 flex flex-col items-center text-center"
    >
      <div className="relative grid size-28 place-items-center" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <motion.span
              key={i}
              className={cn(
                "absolute size-3 rounded-full",
                i % 3 === 0 ? "bubble-orb size-4" : i % 2 ? "bg-[radial-gradient(circle_at_35%_30%,#fff,#8ff0bb_45%,#23a865)]" : "bg-[radial-gradient(circle_at_35%_30%,#fff,#ffd45c_45%,#eaa21c)]"
              )}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x: Math.cos(angle) * 84, y: Math.sin(angle) * 84, opacity: [0, 1, 0], scale: [0, 1, 0.7] }}
              transition={{ duration: 1.2, ease: easeOut, delay: 0.15 + (i % 4) * 0.04 }}
            />
          )
        })}
        <motion.span
          className="aero-gel aero-gel--green grid size-24 place-items-center rounded-full"
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 13 }}
        >
          <PartyPopper className="size-11" aria-hidden="true" />
        </motion.span>
      </div>
      <p className="mt-5 font-heading text-[2rem] leading-none font-extrabold text-deep" role="status">
        Congratulations!
      </p>
      <p className="mt-2 max-w-[24ch] text-[1.15rem] leading-snug text-deep-soft">
        Your bill today is on the house.
      </p>
      <p className="aero-chip mt-4 rounded-full px-4 py-1.5 text-[0.95rem] font-bold text-leaf-ink">
        100% discount applied
      </p>
      <DialogClose asChild>
        <Button variant="gel" size="pill" className="mt-6 h-14 w-full text-[1.15rem]">
          Back to cart
        </Button>
      </DialogClose>
    </motion.div>
  )
}

function LostPanel({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="mt-7 flex flex-col items-center text-center"
    >
      <p className="font-heading text-[1.7rem] leading-none font-extrabold text-deep" role="status">
        Out of tries
      </p>
      <p className="mt-2 max-w-[28ch] text-[1.05rem] leading-snug text-deep-soft">
        The word stays a secret for now. Have another go?
      </p>
      <Button variant="gel-green" size="pill" className="mt-6 h-13 w-full" onClick={onRetry}>
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
      <DialogClose asChild>
        <Button variant="glass" size="pill" className="mt-2.5 w-full">
          Back to cart
        </Button>
      </DialogClose>
    </motion.div>
  )
}
