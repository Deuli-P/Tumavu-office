export interface Company {
  id: string
  name: string
  address: string
  description?: string
  ownerId: string
  ownerName: string
  jobsCount: number
  usersCount: number
  createdAt: string
}

export interface CreateCompanyPayload {
  name: string
  address: string
  description?: string
  ownerId: string
}
