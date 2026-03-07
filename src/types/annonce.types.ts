export type JobOfferStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED'
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'INTERVIEW' | 'TEST' | 'PHONE'
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'DELETED'

export interface AnnouncementAttachment {
  attachment: {
    id: number
    filename: string
    url: string
    mimeType: string | null
    size: number | null
  }
}

export interface AnnouncementListItem {
  id: number
  title: string
  description: string | null
  status: AnnouncementStatus
  publishedAt: string | null
  createdAt: string
  creator: { id: string; firstName: string; lastName: string }
  attachments: AnnouncementAttachment[]
}
