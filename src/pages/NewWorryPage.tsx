import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { worriesApi } from '../api'
import SliderField from '../components/SliderField'
import FactorsList from '../components/FactorsList'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Max 50 characters'),
  prophecy: z.string().min(1, 'Prophecy is required'),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewWorryPage() {
  const navigate = useNavigate()
  const [preAnxiety, setPreAnxiety] = useState(50)
  const [assurance, setAssurance] = useState(50)
  const [factors, setFactors] = useState<string[]>([])
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const titleValue = watch('title', '')

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await worriesApi.create({
        title: data.title,
        prophecy: data.prophecy,
        preAnxietyLevel: preAnxiety,
        assurance,
        description: data.description || undefined,
        factors,
      })
      navigate('/home')
    } catch {
      setError('שמירה נכשלה. אנא נסה שוב.')
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-6 px-5 rounded-b-[32px]"
        style={{ background: 'linear-gradient(160deg, #1E0A4F 0%, #0A0818 100%)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold">דאגה חדשה</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">
        {error && (
          <div className="text-sm rounded-xl px-4 py-3"
            style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-[#EDE9FE]">כותרת *</label>
            <span className="text-xs text-[#5B4F7A]">{titleValue.length}/50</span>
          </div>
          <input
            {...register('title')}
            maxLength={50}
            className="input-dark"
            placeholder="תן לדאגה שם קצר…"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-[#EDE9FE] mb-1.5 block">
            תיאור <span className="text-[#5B4F7A] font-normal">(אופציונלי)</span>
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className="input-dark resize-none"
            placeholder="פרטים נוספים…"
          />
        </div>

        {/* Factors */}
        <FactorsList factors={factors} onChange={setFactors} />

        {/* Pre-anxiety slider */}
        <SliderField label="כמה אתה חרד עכשיו?" value={preAnxiety} onChange={setPreAnxiety} />

        {/* Prophecy */}
        <div>
          <label className="text-sm font-semibold text-[#EDE9FE] mb-1.5 block">מה הנבואה? *</label>
          <textarea
            {...register('prophecy')}
            rows={3}
            className="input-dark resize-none"
            placeholder="מה אתה חושב שיקרה…"
          />
          {errors.prophecy && <p className="text-red-400 text-xs mt-1">{errors.prophecy.message}</p>}
        </div>

        {/* Assurance slider */}
        <SliderField label="כמה אתה בטוח שזה יקרה?" value={assurance} onChange={setAssurance} />
      </form>

      {/* Sticky save button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #0A0818 60%, transparent)' }}
      >
        <button
          type="submit"
          form="new-worry-form"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="btn-primary w-full py-4 text-sm"
        >
          {isSubmitting ? 'שומר…' : 'שמור דאגה'}
        </button>
      </div>
    </div>
  )
}
