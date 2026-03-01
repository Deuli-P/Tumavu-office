import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const GuestOnlyLayout = () => {
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (user?.id) return <Navigate replace to="/app" />

  return <Outlet />
}

export default GuestOnlyLayout
