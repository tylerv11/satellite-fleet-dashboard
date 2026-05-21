import type { Filters } from '../types/satellite'
import { satellites } from '../data/satellites'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort()
}

const countries = unique(satellites.map((s) => s.country))
const purposes = unique(satellites.map((s) => s.purpose))
const orbitClasses = unique(satellites.map((s) => s.orbitClass))
const statuses = ['Operational', 'Degraded', 'End of Life']

const FILTER_DEFS: { label: string; key: keyof Filters; options: string[] }[] = [
  { label: 'Country', key: 'country', options: countries },
  { label: 'Purpose', key: 'purpose', options: purposes },
  { label: 'Orbit Class', key: 'orbitClass', options: orbitClasses },
  { label: 'Status', key: 'status', options: statuses },
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const handleChange = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, [key]: e.target.value })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
      <div className="flex flex-wrap gap-6 items-end">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest self-center">
          Filter by
        </p>
        {FILTER_DEFS.map(({ label, key, options }) => (
          <div key={key} className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-medium text-gray-500" htmlFor={`filter-${key}`}>
              {label}
            </label>
            <select
              id={`filter-${key}`}
              value={filters[key]}
              onChange={handleChange(key)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
        {Object.values(filters).some((v) => v !== 'All') && (
          <button
            onClick={() => onChange({ country: 'All', purpose: 'All', orbitClass: 'All', status: 'All' })}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium self-end pb-2"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
