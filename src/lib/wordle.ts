export const ANSWER = "AERO"
export const WORD_LENGTH = ANSWER.length
export const MAX_TRIES = 4

export type TileState = "correct" | "present" | "absent"

/**
 * Standard Wordle scoring: exact matches first, then "present" letters,
 * counting each answer letter only as many times as it actually appears.
 */
export function evaluateGuess(guess: string, answer: string = ANSWER): TileState[] {
  const result: TileState[] = Array.from({ length: answer.length }, () => "absent")
  const remaining = new Map<string, number>()

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = "correct"
    else remaining.set(answer[i], (remaining.get(answer[i]) ?? 0) + 1)
  }
  for (let i = 0; i < answer.length; i++) {
    if (result[i] === "correct") continue
    const left = remaining.get(guess[i]) ?? 0
    if (left > 0) {
      result[i] = "present"
      remaining.set(guess[i], left - 1)
    }
  }
  return result
}

const rank: Record<TileState, number> = { absent: 0, present: 1, correct: 2 }

/** The best-known state of every letter guessed so far, for the keyboard. */
export function letterStates(guesses: string[]): Map<string, TileState> {
  const states = new Map<string, TileState>()
  for (const guess of guesses) {
    evaluateGuess(guess).forEach((state, i) => {
      const letter = guess[i]
      const current = states.get(letter)
      if (!current || rank[state] > rank[current]) states.set(letter, state)
    })
  }
  return states
}

export const STATE_LABEL: Record<TileState, string> = {
  correct: "right spot",
  present: "wrong spot",
  absent: "not in the word",
}
