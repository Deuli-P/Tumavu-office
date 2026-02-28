export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'ADMIN'
  companyName?: string
  createdAt: string
  lastLoginAt?: string
}
