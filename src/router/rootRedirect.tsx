import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

const RootRedirect = () => {
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (!user?.id) {
    return <Navigate replace to="/auth/login/admin" />
  }

  return <Navigate replace to="/app" />
}

export default RootRedirect
