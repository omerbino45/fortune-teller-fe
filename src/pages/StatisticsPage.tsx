import BottomNav from '../components/BottomNav'

export default function StatisticsPage() {
  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <div className="bg-[#7C3AED] pt-14 pb-8 px-5 rounded-b-[32px]">
        <h1 className="text-white text-2xl font-bold">Statistics</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-24">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 font-semibold">Coming soon</p>
        <p className="text-gray-400 text-sm mt-1">Your data patterns will appear here.</p>
      </div>

      <BottomNav active="statistics" />
    </div>
  )
}
