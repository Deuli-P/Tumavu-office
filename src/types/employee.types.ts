export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department?: string
  hiredAt: string
  companyId: string
  avatarUrl?: string
}

export interface AddEmployeePayload {
  name: string
  email: string
  position: string
  department?: string
  hiredAt: string
}
