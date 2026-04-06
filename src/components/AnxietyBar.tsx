export default function AnxietyBar({ value, color = '#7C3AED' }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-8 text-right">{value}</span>
    </div>
  )
}
