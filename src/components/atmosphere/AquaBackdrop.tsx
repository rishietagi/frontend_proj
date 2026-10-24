import { FloatingBubbles } from "./FloatingBubbles"
import { Glints } from "./Glints"

/**
 * The fixed environment behind every screen: a sunlit sky that deepens
 * into water, slow light rays, Aero light ribbons, caustic shimmer near
 * the bottom, and bubbles rising at three depths.
 */
export function AquaBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Sky → water gradient with soft aurora pools */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(60% 45% at 12% 4%, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0) 70%)",
            "radial-gradient(45% 35% at 92% 18%, rgb(101 230 160 / 0.32), transparent 70%)",
            "radial-gradient(55% 40% at 4% 92%, rgb(101 230 160 / 0.38), transparent 70%)",
            "radial-gradient(70% 50% at 85% 100%, rgb(57 217 208 / 0.55), transparent 70%)",
            "linear-gradient(180deg, #e8faff 0%, #bdeeff 24%, #8adffb 52%, #4fcbe8 78%, #21aed6 100%)",
          ].join(","),
        }}
      />

      <div className="light-rays" />

      {/* Aero light ribbons */}
      <svg
        className="swoosh absolute inset-x-[-5%] top-[18%] h-[70%] w-[110%]"
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ribbon-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".35" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".7" stopColor="#E9FFFB" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ribbon-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#B8FFE0" stopOpacity="0" />
            <stop offset=".45" stopColor="#B8FFE0" stopOpacity=".4" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-40 420 C 260 250, 560 560, 900 380 S 1320 220, 1480 300 L 1480 336 C 1320 262, 1180 330, 900 420 S 260 300, -40 470 Z"
          fill="url(#ribbon-a)"
        />
        <path
          d="M-40 520 C 300 380, 640 640, 980 470 S 1340 360, 1480 420 L 1480 436 C 1340 380, 1180 450, 980 500 S 320 420, -40 540 Z"
          fill="url(#ribbon-b)"
        />
        <path
          d="M-40 300 C 380 200, 700 420, 1040 300 S 1380 210, 1480 240"
          fill="none"
          stroke="#fff"
          strokeOpacity=".55"
          strokeWidth="1.5"
        />
      </svg>

      {/* Caustic shimmer near the water's depth */}
      <svg
        className="caustics absolute inset-x-0 bottom-0 h-[55%] w-full opacity-[0.35] mix-blend-soft-light"
        style={{
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 45%)",
          maskImage: "linear-gradient(180deg, transparent, #000 45%)",
        }}
        preserveAspectRatio="none"
      >
        <filter id="caustic" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.022" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0.05 0.9 0.05 0 0" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#caustic)" />
      </svg>

      <FloatingBubbles />

      <Glints
        glints={[
          { top: "12%", left: "22%", size: 16, delay: 1 },
          { top: "30%", left: "86%", size: 22, delay: 4.5, twinkle: 9 },
          { top: "64%", left: "8%", size: 14, delay: 7, twinkle: 10 },
          { top: "78%", left: "72%", size: 18, delay: 2.8, twinkle: 11 },
        ]}
      />
    </div>
  )
}
