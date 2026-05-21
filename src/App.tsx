import { useState, useMemo } from 'react'
import { satellites } from './data/satellites'
import type { Filters } from './types/satellite'
import { KpiCard } from './components/KpiCard'
import { FilterBar } from './components/FilterBar'
import { FleetChart } from './components/FleetChart'
import { SatelliteTable } from './components/SatelliteTable'
import { GlobeView } from './components/GlobeView'

const DEFAULT_FILTERS: Filters = {
  country: 'All',
  purpose: 'All',
  orbitClass: 'All',
  status: 'All',
}

const REPO_URL = 'https://github.com/tylerv11/satellite-fleet-dashboard'
const LIVE_URL = 'https://tylerv11.github.io/satellite-fleet-dashboard/'

export default function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const filtered = useMemo(
    () =>
      satellites.filter(
        (s) =>
          (filters.country === 'All' || s.country === filters.country) &&
          (filters.purpose === 'All' || s.purpose === filters.purpose) &&
          (filters.orbitClass === 'All' || s.orbitClass === filters.orbitClass) &&
          (filters.status === 'All' || s.status === filters.status)
      ),
    [filters]
  )

  const total = filtered.length
  const opCount = filtered.filter((s) => s.status === 'Operational').length
  const pctOp = total > 0 ? ((opCount / total) * 100).toFixed(1) + '%' : 'N/A'
  const avgLife =
    total > 0
      ? (filtered.reduce((sum, s) => sum + s.expectedLifetimeYears, 0) / total).toFixed(1) + ' yrs'
      : 'N/A'
  const atRisk = filtered.filter((s) => s.status !== 'Operational').length

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Satellite Fleet Operations Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Real-time fleet analytics built on publicly available data from the{' '}
                <span className="text-slate-300 font-medium">UCS Satellite Database</span> (May 2023,{' '}
                {satellites.length.toLocaleString()} tracked assets). View the live dashboard{' '}
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  here
                </a>{' '}
                and explore the pipeline at{' '}
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  this repo
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Fleet Size" value={total.toLocaleString()} subtitle="filtered assets" accent="blue" />
          <KpiCard title="Operational" value={pctOp} subtitle="of filtered fleet" accent="green" />
          <KpiCard title="Avg Lifetime" value={avgLife} subtitle="expected service life" accent="blue" />
          <KpiCard
            title="Degraded / End of Life"
            value={atRisk}
            subtitle="units requiring attention"
            accent="amber"
          />
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        <GlobeView data={filtered} />

        <FleetChart data={filtered} />

        <SatelliteTable data={filtered} />
      </main>
    </div>
  )
}
