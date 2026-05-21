interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  accent?: 'blue' | 'green' | 'amber' | 'red'
}

const accentMap: Record<NonNullable<KpiCardProps['accent']>, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-500',
  red: 'text-red-600',
}

export function KpiCard({ title, value, subtitle, accent = 'blue' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className={`mt-2 text-4xl font-bold tabular-nums ${accentMap[accent]}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  )
}
