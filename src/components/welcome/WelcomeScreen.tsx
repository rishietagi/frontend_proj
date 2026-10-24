import { motion } from "motion/react"

import { GlossLeaf } from "@/components/brand/Brand"
import { Sparkle } from "@/components/atmosphere/Glints"
import { Button } from "@/components/ui/button"
import { useScreenFocus } from "@/hooks/useScreenFocus"
import { pluralItems } from "@/lib/format"
import { easeOut, riseIn, stagger } from "@/lib/motion"

interface WelcomeScreenProps {
  onOrder: () => void
  savedCount: number
  focusOnMount: boolean
}

export function WelcomeScreen({ onOrder, savedCount, focusOnMount }: WelcomeScreenProps) {
  const headingRef = useScreenFocus<HTMLHeadingElement>(focusOnMount)

  return (
    <main
      id="main"
      className="relative flex min-h-dvh items-center justify-center px-4 py-16 sm:px-8"
    >
      {/* Greenery peeking in from the corners */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -bottom-10 -left-6 flex items-end sm:left-[4%]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.5 }}
        >
          <GlossLeaf className="leaf-sway h-44 w-auto -rotate-[28deg] sm:h-64" />
          <GlossLeaf tone="deep" className="leaf-sway -ml-14 h-56 w-auto rotate-[6deg] [animation-delay:-3s] sm:h-80" />
          <GlossLeaf className="leaf-sway -ml-12 h-36 w-auto rotate-[34deg] [animation-delay:-5s] sm:h-52" />
        </motion.div>
        <motion.div
          className="absolute -right-8 -bottom-12 flex items-end sm:right-[5%]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.65 }}
        >
          <GlossLeaf tone="deep" className="leaf-sway h-48 w-auto -rotate-[18deg] [animation-delay:-2s] sm:h-72" />
          <GlossLeaf className="leaf-sway -ml-12 h-40 w-auto rotate-[26deg] [animation-delay:-4s] sm:h-56" />
        </motion.div>
      </div>

      <div className="relative w-full max-w-[52rem]">
        {/* A large lens-bubble resting behind the pane */}
        <motion.div
          aria-hidden="true"
          className="float-slow bubble-orb absolute -top-16 -right-6 size-36 rounded-full sm:-top-20 sm:-right-14 sm:size-52"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: easeOut, delay: 0.25 }}
        />
        <motion.div
          aria-hidden="true"
          className="float-slow bubble-orb absolute -bottom-8 -left-4 size-16 rounded-full [animation-delay:-4s] sm:-left-10 sm:size-24"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: easeOut, delay: 0.4 }}
        />

        <motion.section
          aria-labelledby="welcome-title"
          className="aero-glass relative overflow-hidden rounded-[2.5rem] px-5 pt-10 pb-11 text-center sm:rounded-[3rem] sm:px-14 sm:pt-14 sm:pb-14"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          {/* Inner water line: a soft aqua pool at the base of the pane */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
            style={{
              background:
                "radial-gradient(80% 90% at 50% 120%, rgb(57 217 208 / 0.28), transparent 70%)",
            }}
          />
          <Sparkle size={20} className="glint absolute top-8 left-[12%] [--delay:2s] [--twinkle:6s]" />
          <Sparkle size={14} className="glint absolute right-[16%] bottom-24 [--delay:5s] [--twinkle:8s]" />

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: stagger(0.14, 0.35) } }}
            className="flex flex-col items-center"
          >
            <motion.p
              variants={riseIn}
              className="aero-chip label-caps rounded-2xl px-4 py-2 text-[0.7rem] leading-snug text-ocean-ink sm:rounded-full sm:text-[0.78rem]"
            >
              <span>Your private dinner experience</span>
              <span className="max-sm:hidden"> · </span>
              <span className="max-sm:block">Est. today</span>
            </motion.p>

            <h1
              id="welcome-title"
              ref={headingRef}
              tabIndex={-1}
              className="mt-7 flex flex-col items-center leading-[0.95] outline-none sm:mt-9"
            >
              <motion.span
                variants={riseIn}
                className="font-heading text-[clamp(1.6rem,6vw,2.6rem)] font-semibold tracking-tight text-deep"
              >
                Welcome to
              </motion.span>{" "}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 18 } },
                }}
                className="gel-type mt-1 font-heading text-[clamp(2.55rem,11.4vw,6.6rem)] font-extrabold tracking-[-0.02em]"
                data-text="Rishi’s Kitchen"
              >
                Rishi&rsquo;s Kitchen
              </motion.span>
            </h1>

            <motion.p
              variants={riseIn}
              className="mt-6 max-w-[34ch] text-[1.1rem] leading-relaxed text-deep-soft sm:mt-7 sm:text-[1.25rem]"
            >
              A little something made with love, a little sauce, and a lot of good intentions.
            </motion.p>

            <motion.div variants={riseIn} className="mt-9 flex flex-col items-center gap-4 sm:mt-10">
              <Button variant="gel" size="hero" onClick={onOrder}>
                Order Food
              </Button>
              <p className="text-[0.98rem] font-medium text-deep-soft">
                Freshly made. Very lovingly served.
              </p>
              {savedCount > 0 && (
                <p className="aero-chip rounded-full px-4 py-1.5 text-sm font-semibold text-ocean-ink">
                  {pluralItems(savedCount)} still waiting in your order
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  )
}
