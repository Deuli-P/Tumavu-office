export interface AdminUser {
  id: string
  name: string
  country: string
  role: 'owner' | 'admin' | 'ADMIN'
  companyName?: string
  createdAt: string
  lastLoginAt?: string
}
