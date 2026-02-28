export type JobStatus = 'active' | 'draft' | 'closed'
export type ContractType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'

export interface Job {
  id: string
  title: string
  description: string
  location: string
  contractType: ContractType
  salary?: string
  status: JobStatus
  companyId: string
  applicationsCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateJobPayload {
  title: string
  description: string
  location: string
  contractType: ContractType
  salary?: string
  status: JobStatus
}

export interface EditJobPayload extends CreateJobPayload {
  id: string
}

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  resumeUrl?: string
  coverLetter?: string
  status: ApplicationStatus
  appliedAt: string
}
