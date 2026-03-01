import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const AdminOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (!token) {
    return <Navigate replace to="/auth/login/choice" />
  }

  if (user?.info?.role?.type !== 'ADMIN') {
    return <Navigate replace to="/app" />
  }

  return <Outlet />
}

export default AdminOnlyLayout
