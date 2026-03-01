import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

const AuthOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (!token) {
    return <Navigate replace to="/auth/login/choice" />
  }

  // Un utilisateur est considéré connecté uniquement si token + user chargé
  if (!user?.id) {
    return <Navigate replace to="/auth/login/choice" />
  }

  return <Outlet />
}

export default AuthOnlyLayout
