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
      setError('Failed to save. Please try again.')
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="bg-[#7C3AED] pt-14 pb-6 px-5 rounded-b-[32px]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold">New Worry</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Title *</label>
            <span className="text-xs text-gray-400">{titleValue.length}/50</span>
          </div>
          <input
            {...register('title')}
            maxLength={50}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
            placeholder="Give this worry a short name…"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Prophecy */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">What do you think will happen? *</label>
          <textarea
            {...register('prophecy')}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition resize-none"
            placeholder="Describe your fear in detail…"
          />
          {errors.prophecy && <p className="text-red-500 text-xs mt-1">{errors.prophecy.message}</p>}
        </div>

        {/* Pre-anxiety slider */}
        <SliderField
          label="How anxious do you feel right now?"
          value={preAnxiety}
          onChange={setPreAnxiety}
        />

        {/* Assurance slider */}
        <SliderField
          label="How confident are you this will happen?"
          value={assurance}
          onChange={setAssurance}
        />

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Additional context <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition resize-none"
            placeholder="Any extra details…"
          />
        </div>

        {/* Factors */}
        <FactorsList factors={factors} onChange={setFactors} />
      </form>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4 bg-gradient-to-t from-[#F5F3FF] via-[#F5F3FF] to-transparent">
        <button
          type="submit"
          form="new-worry-form"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition"
        >
          {isSubmitting ? 'Saving…' : 'Save Worry'}
        </button>
      </div>
    </div>
  )
}
