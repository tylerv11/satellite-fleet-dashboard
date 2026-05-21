import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Satellite } from '../types/satellite'

interface FleetChartProps {
  data: Satellite[]
}

const PURPOSES: Satellite['purpose'][] = [
  'Communications',
  'Earth Observation',
  'Navigation',
  'Reconnaissance',
  'Technology Development',
]

const tickShorten: Record<string, string> = {
  'Earth Observation': 'Earth Obs',
  'Technology Development': 'Tech Dev',
}

function formatTick(val: string): string {
  return tickShorten[val] ?? val
}

export function FleetChart({ data }: FleetChartProps) {
  const chartData = PURPOSES.map((purpose) => {
    const group = data.filter((s) => s.purpose === purpose)
    return {
      purpose,
      Operational: group.filter((s) => s.status === 'Operational').length,
      Degraded: group.filter((s) => s.status === 'Degraded').length,
      'End of Life': group.filter((s) => s.status === 'End of Life').length,
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-5">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-5">
        Fleet Distribution by Mission Purpose
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="purpose"
            tickFormatter={formatTick}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
          <Bar dataKey="Operational" stackId="stack" fill="#22c55e" />
          <Bar dataKey="Degraded" stackId="stack" fill="#f59e0b" />
          <Bar dataKey="End of Life" stackId="stack" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
