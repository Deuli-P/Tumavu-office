export interface User {
  id: string
  name: string
  email: string
  companyId: string
  companyName: string
  role: 'owner' | 'admin'
  avatarUrl?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  companyName: string
  password: string
  confirmPassword: string
}
