import { useState } from 'react'
import type { Satellite } from '../types/satellite'

interface SatelliteTableProps {
  data: Satellite[]
}

type SortKey = Extract<
  keyof Satellite,
  'name' | 'country' | 'operator' | 'purpose' | 'orbitClass' | 'launchDate' | 'expectedLifetimeYears' | 'status'
>

interface SortConfig {
  key: SortKey
  dir: 'asc' | 'desc'
}

const STATUS_BADGE: Record<Satellite['status'], string> = {
  Operational: 'bg-green-100 text-green-800',
  Degraded: 'bg-amber-100 text-amber-800',
  'End of Life': 'bg-red-100 text-red-800',
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'operator', label: 'Operator' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'orbitClass', label: 'Orbit' },
  { key: 'launchDate', label: 'Launch Date' },
  { key: 'expectedLifetimeYears', label: 'Lifetime (yrs)' },
  { key: 'status', label: 'Status' },
]

function SortIndicator({ col, sort }: { col: SortKey; sort: SortConfig }) {
  if (sort.key !== col) return <span className="ml-1 text-gray-300 text-xs">↕</span>
  return <span className="ml-1 text-blue-500 text-xs">{sort.dir === 'asc' ? '↑' : '↓'}</span>
}

export function SatelliteTable({ data }: SatelliteTableProps) {
  const [sort, setSort] = useState<SortConfig>({ key: 'name', dir: 'asc' })

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sort.key]
    const bv = b[sort.key]
    let cmp: number
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv
    } else {
      cmp = String(av).localeCompare(String(bv))
    }
    return sort.dir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest">
          Satellite Inventory
        </h2>
        <span className="text-sm text-gray-400 tabular-nums">
          {data.length} record{data.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="bg-gray-50">
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:bg-gray-100 transition-colors"
                >
                  {label}
                  <SortIndicator col={key} sort={sort} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((sat) => (
              <tr key={sat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{sat.name}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{sat.country}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{sat.operator}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{sat.purpose}</td>
                <td className="px-4 py-3 text-gray-600">{sat.orbitClass}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap tabular-nums">{sat.launchDate}</td>
                <td className="px-4 py-3 text-gray-600 text-center tabular-nums">
                  {sat.expectedLifetimeYears}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_BADGE[sat.status]}`}
                  >
                    {sat.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
