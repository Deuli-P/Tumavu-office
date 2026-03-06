export interface CountryOption {
  id: number
  name: string
  code: string
}

export interface StationData {
  id: number
  name: string
  country: CountryOption
  officeAddress: {
    street: string
    streetNumber: string | null
    zipCode: string
    locality: string
    country: CountryOption
  }
}

export interface CreateStationPayload {
  name: string
  countryId: number
  officeAddress: {
    street: string
    streetNumber?: string
    zipCode: string
    locality: string
  }
}
