"use client"

export function GalaxyBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Deep space base — rich dark with slight depth variation */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 180% 120% at 60% 40%, #0c0c0e 0%, #000000 55%, #000000 100%)
          `,
        }}
      />

      {/* Milky Way galactic band — wide diagonal sweep of star-dust haze */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              108deg,
              transparent 0%,
              transparent 18%,
              rgba(255,255,255,0.012) 26%,
              rgba(255,255,255,0.028) 32%,
              rgba(255,255,255,0.038) 38%,
              rgba(255,255,255,0.022) 44%,
              rgba(255,255,255,0.032) 48%,
              rgba(255,255,255,0.018) 54%,
              rgba(255,255,255,0.008) 60%,
              transparent 72%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Galactic core glow — bright dense center of the band */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 90% 22% at 52% 52%, rgba(255,252,240,0.055) 0%, rgba(255,248,220,0.025) 35%, transparent 70%)
          `,
          transform: "rotate(-18deg)",
          transformOrigin: "center center",
        }}
      />

      {/* Nebula cloud 1 — upper left, deep purple haze */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 55% 35% at 12% 22%, rgba(120,60,200,0.028) 0%, rgba(90,40,160,0.012) 50%, transparent 80%)
          `,
        }}
      />

      {/* Nebula cloud 2 — lower right warm dust */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 88% 78%, rgba(255,235,200,0.016) 0%, rgba(255,220,180,0.007) 50%, transparent 80%)
          `,
        }}
      />

      {/* Nebula cloud 3 — light purple mid-right bloom */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 45% 30% at 78% 15%, rgba(168,100,255,0.022) 0%, rgba(140,80,220,0.010) 45%, transparent 75%)
          `,
        }}
      />

      {/* Nebula cloud 4 — deep purple lower left, counter-rotating */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 40% 25% at 18% 72%, rgba(100,40,180,0.020) 0%, rgba(80,30,140,0.008) 55%, transparent 80%)
          `,
        }}
      />

      {/* Faint second dust lane threading across the band */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            linear-gradient(
              112deg,
              transparent 0%,
              transparent 30%,
              rgba(255,255,255,0.009) 36%,
              rgba(255,255,255,0.016) 40%,
              rgba(255,255,255,0.009) 44%,
              transparent 52%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Subtle vignette to pull the edges into darkness */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)
          `,
        }}
      />
    </div>
  )
}
