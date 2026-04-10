export type WorryStatus = 'Active' | 'Resolved'

export interface Worry {
  id: string
  status: WorryStatus
  title: string
  description: string | null
  factors: string[]
  preAnxietyLevel: number
  prophecy: string
  assurance: number
  actualOutcome: string | null
  postAnxietyLevel: number | null
  createdAt: string
  assuranceUpdatedAt: string
}

export interface AuthResponse {
  token: string
  userId: string
  name: string
  isEmailVerified: boolean
}

export interface RegisterResponse {
  message: string
  email: string
}
