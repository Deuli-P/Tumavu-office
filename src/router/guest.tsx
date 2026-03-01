import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const GuestOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (token) {
    return <Navigate replace to={user?.info?.role?.type === 'ADMIN' ? '/admin' : '/app'} />
  }

  return <Outlet />
}

export default GuestOnlyLayout
