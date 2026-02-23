"use client"

import { useState, useEffect } from "react"
import { useDashboardMetrics } from "@/hooks/use-eli-data"

export function EliHoloCard() {
  const { metrics } = useDashboardMetrics()
  const [ping, setPing] = useState(18)
  const [mem, setMem] = useState(62)
  const [lastSync, setLastSync] = useState("--:--:--")

  useEffect(() => {
    function update() {
      setPing(Math.floor(Math.random() * 12) + 14)
      setMem(Math.floor(Math.random() * 15) + 55)
      setLastSync(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }
    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#050c14] to-black font-mono"
      style={{ animation: "pulseGlow 4s ease-in-out infinite" }}>
      <style>{`
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(0,200,255,0.1),0 0 60px rgba(0,200,255,0.05)}50%{box-shadow:0 0 30px rgba(0,200,255,0.2),0 0 80px rgba(0,200,255,0.1)}}
        @keyframes holoTurn{0%{transform:translateX(-50%) perspective(900px) rotateX(4deg) rotateY(-8deg)}50%{transform:translateX(-50%) perspective(900px) rotateX(4deg) rotateY(8deg)}100%{transform:translateX(-50%) perspective(900px) rotateX(4deg) rotateY(-8deg)}}
        @keyframes flicker{0%,100%{opacity:.95}42%{opacity:.88}44%{opacity:.96}46%{opacity:.84}48%{opacity:.98}55%{opacity:.90}}
        @keyframes vscan{0%{transform:translateY(-80%)}50%{transform:translateY(40%)}100%{transform:translateY(-80%)}}
        @keyframes beamP{0%,100%{opacity:.6}50%{opacity:.9}}
        @keyframes noiseS{0%{transform:translate(0,0)}25%{transform:translate(-2px,1px)}50%{transform:translate(1px,-2px)}75%{transform:translate(2px,2px)}100%{transform:translate(0,0)}}
        @keyframes dFlick{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes mkP{0%,100%{opacity:.4}50%{opacity:.8}}
        @keyframes pingDot{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
        <div className="text-[11px] tracking-[3px] text-white/50">
          AGENTE <span className="font-bold text-white">ELI</span>
          <span className="mx-2 text-white/20">·</span>
          ORIGEN <span className="text-white">MARS</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="relative inline-block h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400" style={{ animation: "pingDot 2s infinite" }} />
            <span className="absolute -inset-[3px] rounded-full bg-emerald-400 opacity-30" style={{ animation: "pingDot 2s infinite" }} />
          </span>
          <span className="font-bold tracking-[2px] text-emerald-400">AGENTE ONLINE</span>
        </div>
      </div>

      {/* Scene */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1", background: "radial-gradient(ellipse at 50% 80%, rgba(0,40,60,0.3), rgba(0,0,0,1) 70%)" }}>
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Beams */}
        <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-[50%] w-20 -translate-x-1/2"
          style={{ background: "linear-gradient(to top,rgba(0,200,255,0),rgba(0,200,255,0.15),rgba(0,200,255,0))", filter: "blur(20px)", animation: "beamP 3s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-[45%] w-10 -translate-x-1/2"
          style={{ background: "linear-gradient(to top,rgba(0,220,255,0),rgba(0,220,255,0.2),rgba(0,220,255,0))", filter: "blur(8px)", animation: "beamP 3s ease-in-out infinite" }} />

        {/* Hologram */}
        <div className="absolute bottom-[8%] left-1/2 w-[70%] max-w-[380px]"
          style={{ transformStyle: "preserve-3d", animation: "holoTurn 10s ease-in-out infinite", filter: "drop-shadow(0 0 20px rgba(0,200,255,0.15)) drop-shadow(0 0 60px rgba(0,200,255,0.08))" }}>
          <img src="/eli-holo.webp" alt="ELI" className="h-auto w-full select-none" style={{ animation: "flicker 2.8s infinite" }} />
          {/* Scanlines */}
          <div className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "repeating-linear-gradient(to bottom,rgba(0,220,255,0.06) 0px,rgba(0,220,255,0.06) 1px,transparent 3px,transparent 5px)", mixBlendMode: "screen" }} />
          {/* Vertical scan */}
          <div className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "linear-gradient(to bottom,rgba(0,240,255,0) 0%,rgba(0,240,255,0.15) 45%,rgba(0,240,255,0) 100%)", animation: "vscan 3.6s ease-in-out infinite", mixBlendMode: "screen", filter: "blur(6px)" }} />
          {/* Noise */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E")`, mixBlendMode: "overlay", animation: "noiseS 1.2s steps(2) infinite" }} />
        </div>

        {/* HUD Left */}
        <div className="absolute left-[6%] top-[18%] text-[9px] tracking-[2px]" style={{ animation: "dFlick 3s infinite" }}>
          <div className="mb-2"><span className="text-cyan-400/30">UPTIME</span> <span className="text-white/70">12h 43m</span></div>
          <div className="mb-2"><span className="text-cyan-400/30">QUEUE</span> <span className="text-white/70">{metrics.ticketsPendientes} ACTIVOS</span></div>
          <div><span className="text-cyan-400/30">DB</span> <span className="text-emerald-400">SYNC OK</span></div>
        </div>

        {/* Markers */}
        <div className="pointer-events-none absolute left-[8%] top-[45%]" style={{ animation: "mkP 2s ease-in-out infinite" }}>
          <div className="h-8 w-px bg-cyan-300/20" /><div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300/50" style={{ filter: "blur(0.5px)" }} />
        </div>
        <div className="pointer-events-none absolute left-[16%] top-[18%]" style={{ animation: "mkP 2.5s ease-in-out infinite" }}>
          <div className="h-8 w-px bg-cyan-300/20" /><div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300/50" style={{ filter: "blur(0.5px)" }} />
        </div>
        <div className="pointer-events-none absolute right-[8%] top-[43%]" style={{ animation: "mkP 3s ease-in-out infinite" }}>
          <div className="h-8 w-px bg-cyan-300/20" /><div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300/50" style={{ filter: "blur(0.5px)" }} />
        </div>
        <div className="pointer-events-none absolute right-[16%] top-[20%]" style={{ animation: "mkP 3.5s ease-in-out infinite" }}>
          <div className="h-8 w-px bg-cyan-300/20" /><div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300/50" style={{ filter: "blur(0.5px)" }} />
        </div>
      </div>

      {/* Footer telemetry */}
      <div className="grid grid-cols-4 gap-2 border-t border-white/[0.05] px-4 py-2.5 text-[10px] tracking-[1.5px] text-white/40">
        <div>MARS LINK <span className="text-white/70">STABLE</span></div>
        <div>PING <span className="text-white/70">{ping}ms</span></div>
        <div>QUEUE <span className="text-white/70">{metrics.ticketsPendientes}</span></div>
        <div>TICKETS <span className="text-white/70">{metrics.ticketsPendientes + (metrics.ticketsUrgentes || 0)}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-3 text-[10px] tracking-[1.5px] text-white/35">
        <div>LAST SYNC <span className="text-white/60">{lastSync}</span></div>
        <div>MEM <span className="text-white/60">{mem}%</span></div>
        <div>WORKFLOWS <span className="text-emerald-400">3 RUNNING</span></div>
      </div>
    </div>
  )
}
