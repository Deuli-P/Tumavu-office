export interface CompanyListItem {
  id: string
  name: string
  type: string | null
  createdAt: string
  address: {
    locality: string
    country: { id: number; name: string; code: string }
  }
  station: { id: number; name: string }
  owner: { id: string; firstName: string; lastName: string }
  _count: { jobs: number; announcements: number }
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

export interface CreateCompanyWithOwnerPayload {
  name: string
  description?: string
  phone?: string
  type?: string
  address: {
    street: string
    number?: string
    locality: string
    countryId: number
  }
  stationId: number
  owner: {
    firstName: string
    lastName: string
    email: string
  }
}
