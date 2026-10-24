import type { CSSProperties } from "react"

/**
 * The welcome screen's landscape: a deep Aero sky, a sun with lens flare,
 * drifting cumulus, glossy rolling hills and a bright lake in the valley.
 * Pure SVG + CSS, scaled to cover any viewport.
 */
export function MeadowScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1f8fe0 0%, #4cb4f2 26%, #8fd6fb 50%, #d4f4ff 66%, #effcff 74%)",
        }}
      />

      {/* Sun bloom, top-left where the light rays begin */}
      <div
        className="absolute"
        style={{
          left: "4%",
          top: "-14%",
          width: "56vmax",
          height: "56vmax",
          background:
            "radial-gradient(circle, rgb(255 255 255 / 0.98) 0 5%, rgb(255 252 225 / 0.75) 11%, rgb(255 255 255 / 0.25) 28%, transparent 55%)",
          transform: "translateX(-30%)",
        }}
      />

      {/* Lens flare: soft discs along a diagonal from the sun */}
      <div className="flare-pulse absolute inset-0">
        {[
          { x: 24, y: 22, s: 7, c: "rgb(255 255 255 / 0.32)" },
          { x: 34, y: 33, s: 3, c: "rgb(180 240 255 / 0.4)" },
          { x: 46, y: 46, s: 11, c: "rgb(140 230 255 / 0.12)" },
          { x: 58, y: 58, s: 4.5, c: "rgb(170 255 220 / 0.28)" },
          { x: 66, y: 67, s: 2, c: "rgb(255 255 255 / 0.5)" },
        ].map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.s}vmax`,
              height: `${f.s}vmax`,
              background: `radial-gradient(circle, ${f.c} 0 55%, transparent 72%)`,
              border: "1px solid rgb(255 255 255 / 0.18)",
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <Cloud style={{ left: "58%", top: "8%", width: "30vw", "--drift": "80s" } as CSSProperties} />
      <Cloud style={{ left: "-6%", top: "30%", width: "24vw", opacity: 0.85, "--drift": "110s" } as CSSProperties} />
      <Cloud style={{ left: "78%", top: "34%", width: "18vw", opacity: 0.75, "--drift": "95s" } as CSSProperties} />
      <Cloud style={{ left: "30%", top: "3%", width: "14vw", opacity: 0.6, "--drift": "120s" } as CSSProperties} />

      {/* Hills and lake */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[52%] w-full"
        viewBox="0 0 1440 470"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a6ecd0" />
            <stop offset="1" stopColor="#62c9a5" />
          </linearGradient>
          <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b7f78a" />
            <stop offset=".45" stopColor="#5fd877" />
            <stop offset="1" stopColor="#25a85a" />
          </linearGradient>
          <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9cf06a" />
            <stop offset=".35" stopColor="#47cf62" />
            <stop offset="1" stopColor="#14884a" />
          </linearGradient>
          <linearGradient id="hill-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9fbff" />
            <stop offset=".35" stopColor="#7fd9f7" />
            <stop offset="1" stopColor="#1ba3d0" />
          </linearGradient>
          <clipPath id="lake-clip">
            <path d="M380 300 C 560 262, 900 262, 1100 300 C 960 352, 560 356, 380 300 Z" />
          </clipPath>
        </defs>

        {/* Far range, hazy */}
        <path d="M0 210 C 180 150, 330 170, 470 195 S 760 130, 960 170 S 1290 140, 1440 185 V 470 H 0 Z" fill="url(#hill-far)" opacity=".85" />

        {/* Lake in the valley */}
        <path d="M380 300 C 560 262, 900 262, 1100 300 C 960 352, 560 356, 380 300 Z" fill="url(#lake)" />
        <g clipPath="url(#lake-clip)" opacity=".7">
          <g className="lake-shimmer">
            {Array.from({ length: 16 }, (_, i) => (
              <path
                key={i}
                d={`M${370 + i * 52} ${284 + (i % 4) * 11} h ${14 + (i % 3) * 10}`}
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity={0.5 + (i % 2) * 0.35}
              />
            ))}
          </g>
        </g>

        {/* Middle hills */}
        <path d="M0 275 C 150 225, 300 235, 420 290 C 300 330, 120 330, 0 340 Z" fill="url(#hill-mid)" />
        <path d="M1440 265 C 1290 222, 1150 238, 1050 292 C 1170 330, 1330 335, 1440 342 Z" fill="url(#hill-mid)" />

        {/* Near rolling hills with a glossy crest */}
        <path d="M0 360 C 240 290, 520 320, 720 360 S 1180 300, 1440 340 V 470 H 0 Z" fill="url(#hill-near)" />
        <path
          d="M0 360 C 240 290, 520 320, 720 360 S 1180 300, 1440 340 V 372 C 1180 336, 980 384, 720 392 S 240 326, 0 392 Z"
          fill="url(#hill-sheen)"
          opacity=".55"
        />
        <path d="M0 360 C 240 290, 520 320, 720 360 S 1180 300, 1440 340" stroke="#eaffd8" strokeOpacity=".8" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

function Cloud({ style }: { style: CSSProperties }) {
  return (
    <div className="cloud-drift absolute aspect-[2.6/1]" style={style} aria-hidden="true">
      {[
        { l: 0, t: 38, w: 46, h: 58 },
        { l: 22, t: 8, w: 40, h: 82 },
        { l: 48, t: 22, w: 36, h: 70 },
        { l: 66, t: 40, w: 34, h: 54 },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: `${p.w}%`,
            height: `${p.h}%`,
            background:
              "radial-gradient(circle at 45% 35%, #fff 0 45%, rgb(240 250 255 / 0.95) 60%, rgb(205 232 250 / 0.6) 85%, transparent 100%)",
            filter: "blur(1.5px)",
          }}
        />
      ))}
      {/* Flat, slightly shaded base */}
      <span
        className="absolute rounded-full"
        style={{
          left: "4%",
          right: "4%",
          bottom: "0%",
          height: "34%",
          background: "linear-gradient(180deg, #fff, rgb(214 236 250 / 0.95))",
          filter: "blur(2px)",
        }}
      />
    </div>
  )
}
