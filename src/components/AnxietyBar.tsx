function anxietyColor(v: number): [string, string] {
  // returns [lightStart, darkEnd] for gradient
  if (v <= 20) return ['#A7F3D0', '#6EE7B7']   // pastel green
  if (v <= 40) return ['#BFDBFE', '#93C5FD']   // pastel blue
  if (v <= 60) return ['#FDE68A', '#FCD34D']   // pastel yellow
  if (v <= 80) return ['#FED7AA', '#FDBA74']   // pastel orange
  return ['#FECACA', '#FCA5A5']                 // pastel red
}

export default function AnxietyBar({ value }: { value: number }) {
  const [light, dark] = anxietyColor(value)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${light}, ${dark})`,
          }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-8 text-right">{value}</span>
    </div>
  )
}
