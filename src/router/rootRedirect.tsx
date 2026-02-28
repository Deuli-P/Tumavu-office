import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'


const RootRedirect = () => {
  const token = useAuthStore((state) => state.token)
  return <Navigate replace to={token ? '/app' : '/auth/login'} />
};


export default RootRedirect;