import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const AuthOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (!token || !user?.id ) {
    return <Navigate replace to="/auth/login" />
  }


  if (user?.info?.role?.type !== 'ADMIN') {
    logout()
    return <Navigate replace to="/auth/login" />
  }

  return <Outlet />
}

export default AuthOnlyLayout
