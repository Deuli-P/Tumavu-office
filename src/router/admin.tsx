import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const AdminOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (!token) {
    return <Navigate replace to="/auth/login" />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate replace to="/app" />
  }

  return <Outlet />
}

export default AdminOnlyLayout
