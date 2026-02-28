import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const GuestOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (token) {
    return <Navigate replace to={user?.role === 'ADMIN' ? '/admin' : '/app'} />
  }

  return <Outlet />
}

export default GuestOnlyLayout
