import { Fragment } from "react"

/** Keeps hyphenated words like "Pan-Fried" from splitting across lines. */
export function DishName({ name }: { name: string }) {
  const words = name.split(" ")
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
        </Fragment>
      ))}
    </>
  )
}
