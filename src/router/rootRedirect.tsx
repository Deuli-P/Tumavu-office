import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

const RootRedirect = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (!token) {
    return <Navigate replace to="/auth/login/choice" />
  }

  return <Navigate replace to={user?.role === 'ADMIN' ? '/admin' : '/app'} />
}

export default RootRedirect
