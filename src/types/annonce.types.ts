export type JobOfferStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED'
export type ApplicationStatus = 'CONFIRMED' | 'REFUSED' | 'INTERVIEW' | 'SIGNATURE' | 'CANCELLED'

export interface AnnouncementListItem {
  id: number
  title: string
  description: string | null
  createdAt: string
}

export interface AnnouncementDetail {
  id: number
  title: string
  description: string | null
  createdAt: string
}
