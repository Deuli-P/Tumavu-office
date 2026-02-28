export type BenefitCategory = 'health' | 'financial' | 'lifestyle' | 'education' | 'other'

export interface Benefit {
  id: string
  name: string
  description: string
  value?: string
  category: BenefitCategory
  isActive: boolean
  companyId: string
}

export interface CreateBenefitPayload {
  name: string
  description: string
  value?: string
  category: BenefitCategory
  isActive: boolean
}

export interface UpdateBenefitPayload extends CreateBenefitPayload {
  id: string
}
