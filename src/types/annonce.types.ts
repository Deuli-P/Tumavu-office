export type AnnouncementStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED'
export type ApplicationStatus = 'CONFIRMED' | 'REFUSED' | 'INTERVIEW' | 'SIGNATURE' | 'CANCELLED'

export interface AnnouncementListItem {
  id: number
  title: string
  status: AnnouncementStatus | null
  createdAt: string
  job: { id: number; title: string; tags: { tag: { id: number; name: string } }[] } | null
  company: { id: string; name: string; station: { id: number; name: string } | null }
  _count: { applications: number }
}

export interface ApplicantItem {
  id: number
  status: ApplicationStatus | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    phone: string | null
    country: { name: string } | null
    auth: { email: string }
  }
}

export interface AnnouncementDetail {
  id: number
  title: string
  description: string | null
  status: AnnouncementStatus | null
  createdAt: string
  job: { id: number; title: string; contractType: string | null } | null
  company: {
    id: string
    name: string
    phone: string | null
    type: string | null
    address: { locality: string; country: { name: string } }
  }
  applications: ApplicantItem[]
}
