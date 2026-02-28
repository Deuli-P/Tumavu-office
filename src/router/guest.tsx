import { useAuthStore } from '@/store/auth.store'
import { Navigate, Outlet } from 'react-router-dom'


const GuestOnlyLayout = () => {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate replace to="/app" />
  }

  return <Outlet />
};

export default GuestOnlyLayout;