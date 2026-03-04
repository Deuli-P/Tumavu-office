export interface AdminUserItem {
  id: string
  firstName: string
  lastName: string
  email: string
  country: { id: number; name: string; code: string } | null
  role: { id: number; value: string; type: string }
  company: { id: string; name: string } | null
  createdAt: string
  lastLoginAt: string | null
}

export interface PermissionItem {
  id: number
  value: string
  createdAt: string
  roles: { id: number; value: string; type: string }[]
}

export interface RoleWithPermissions {
  id: number
  value: string
  type: string
  permissions: { id: number; value: string }[]
}
