import BottomNav from '../components/BottomNav'

export default function StatisticsPage() {
  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <div className="pt-14 pb-8 px-5 rounded-b-[32px]" style={{ background: 'var(--header-grad)' }}>
        <h1 className="text-white text-2xl font-bold">סטטיסטיקה</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-24 animate-fade-up">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-tx1 font-semibold">בקרוב</p>
        <p className="text-tx3 text-sm mt-1 font-light">הנתונים שלך יופיעו כאן.</p>
      </div>

      <BottomNav active="statistics" />
    </div>
  )
}
