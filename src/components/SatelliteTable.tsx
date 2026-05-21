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

const PAGE_SIZE = 100

function SortIndicator({ col, sort }: { col: SortKey; sort: SortConfig }) {
  if (sort.key !== col) return <span className="ml-1 text-gray-300 text-xs">↕</span>
  return <span className="ml-1 text-blue-500 text-xs">{sort.dir === 'asc' ? '↑' : '↓'}</span>
}

export function SatelliteTable({ data }: SatelliteTableProps) {
  const [sort, setSort] = useState<SortConfig>({ key: 'name', dir: 'asc' })
  const [page, setPage] = useState(0)

  const toggleSort = (key: SortKey) => {
    setPage(0)
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

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest">
          Satellite Inventory
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 tabular-nums">
            {data.length.toLocaleString()} records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              ‹
            </button>
            <span className="text-xs text-gray-500 px-2 tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              »
            </button>
          </div>
        </div>
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
            {pageData.map((sat) => (
              <tr key={sat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-xs truncate">{sat.name}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{sat.country}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[160px] truncate">{sat.operator}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{sat.purpose}</td>
                <td className="px-4 py-3 text-gray-600">{sat.orbitClass}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap tabular-nums">{sat.launchDate}</td>
                <td className="px-4 py-3 text-gray-600 text-center tabular-nums">
                  {sat.expectedLifetimeYears > 0 ? sat.expectedLifetimeYears : '—'}
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
      <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 text-right tabular-nums">
        Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, data.length).toLocaleString()} of {data.length.toLocaleString()}
      </div>
    </div>
  )
}
