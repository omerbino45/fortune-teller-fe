function anxietyColor(v: number): [string, string] {
  if (v <= 20) return ['#A7F3D0', '#6EE7B7']
  if (v <= 40) return ['#BFDBFE', '#93C5FD']
  if (v <= 60) return ['#FDE68A', '#FCD34D']
  if (v <= 80) return ['#FED7AA', '#FDBA74']
  return ['#FECACA', '#FCA5A5']
}

export default function AnxietyBar({ value }: { value: number }) {
  const [light, dark] = anxietyColor(value)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background: 'var(--circle-track)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${light}, ${dark})` }}
        />
      </div>
      <span className="text-sm font-semibold w-8 text-right" style={{ color: dark }}>{value}</span>
    </div>
  )
}
