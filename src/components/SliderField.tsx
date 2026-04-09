interface Props {
  label: string
  value: number
  onChange: (v: number) => void
}

export default function SliderField({ label, value, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4">
      <div className="flex justify-between items-baseline mb-4">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-2xl font-bold text-[#7C3AED]">{value}</span>
      </div>
      <input
        dir="ltr"
        type="range"
        min={0}
        max={100}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
        style={{ '--val': `${value}%`, transform: 'scaleX(-1)' } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  )
}
