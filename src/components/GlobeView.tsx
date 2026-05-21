import { useRef, useEffect, useState } from 'react'
import type { Satellite } from '../types/satellite'

interface GlobePoint {
  lat: number
  lng: number
  altitude: number
  color: string
  label: string
}

const ORBIT_COLOR: Record<Satellite['orbitClass'], string> = {
  LEO: '#38bdf8',
  MEO: '#a78bfa',
  GEO: '#fb923c',
  Elliptical: '#4ade80',
}

const ORBIT_LABEL: Record<Satellite['orbitClass'], string> = {
  LEO: 'Low Earth Orbit',
  MEO: 'Medium Earth Orbit',
  GEO: 'Geostationary',
  Elliptical: 'Elliptical',
}

interface GlobeViewProps {
  data: Satellite[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeComponentType = React.ComponentType<any>

export function GlobeView({ data }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [GlobeComponent, setGlobeComponent] = useState<GlobeComponentType | null>(null)
  const [dims, setDims] = useState({ w: 700, h: 500 })

  useEffect(() => {
    import('react-globe.gl').then((mod) => {
      setGlobeComponent(() => mod.default as GlobeComponentType)
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      setDims({ w: Math.floor(rect.width), h: Math.floor(rect.height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const points: GlobePoint[] = data.map((s) => ({
    lat: s.latitude,
    lng: s.longitude,
    altitude: s.altitudeNorm,
    color: ORBIT_COLOR[s.orbitClass],
    label: `<div style="font-family:sans-serif;font-size:12px;background:rgba(15,23,42,0.92);color:#f1f5f9;padding:6px 10px;border-radius:6px;border:1px solid #334155;pointer-events:none"><b>${s.name}</b><br/>${s.operator}<br/><span style="color:#94a3b8">${ORBIT_LABEL[s.orbitClass]} &middot; ${s.altitudeKm.toLocaleString()} km</span></div>`,
  }))

  return (
    <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Orbital Distribution Globe
        </h2>
        <div className="flex items-center gap-5">
          {(Object.keys(ORBIT_COLOR) as Satellite['orbitClass'][]).map((oc) => (
            <span key={oc} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: ORBIT_COLOR[oc] }}
              />
              {oc}
            </span>
          ))}
        </div>
      </div>

      <div ref={containerRef} style={{ height: '520px' }}>
        {GlobeComponent ? (
          <GlobeComponent
            width={dims.w}
            height={dims.h}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            atmosphereColor="#1e3a5f"
            atmosphereAltitude={0.15}
            pointsData={points}
            pointAltitude="altitude"
            pointColor="color"
            pointRadius={0.28}
            pointLabel="label"
            pointResolution={4}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Loading globe...
          </div>
        )}
      </div>
    </div>
  )
}
