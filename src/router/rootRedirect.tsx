import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

const RootRedirect = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) return null

  if (!token) {
    return <Navigate replace to="/auth/login/choice" />
  }

  return <Navigate replace to={user?.info?.role?.type === 'ADMIN' ? '/admin' : '/app'} />
}

export default RootRedirect
