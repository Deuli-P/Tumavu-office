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

export interface Station {
  id: string
  name: string
  country: {
    code: string
    name: string
    id: string
  }
  address: {
    street: string
    zipCode: string
    city: string
  }
}

export interface CreateCompanyPayload {
  name: string
  address: string
  description?: string
  ownerId: string
}
