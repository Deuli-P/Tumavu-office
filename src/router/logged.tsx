import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'


const AuthOnlyLayout = () => {
 const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate replace to="/auth/login" />
  }

  return <Outlet />
};

export default AuthOnlyLayout;