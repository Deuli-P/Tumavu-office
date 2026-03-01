import { createBrowserRouter } from 'react-router-dom'
import { AdminCompaniesPage } from '@/pages/companies/companies.page'
import { AdminCreateCompanyPage } from '@/pages/companies/create-company.page'
import { AdminUsersPage } from '@/pages/users/users.page'
import GuestOnlyLayout from './guest'
import AuthOnlyLayout from './logged'
import RootRedirect from './rootRedirect'
import { LoginAdminPage } from '@/pages/auth/login/admin.page'
import { Sidebar } from '@/components/layout/Sidebar'
import { AdminDashboardPage } from '@/pages/dashboard/dashboard.page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/auth/login',
    element: <GuestOnlyLayout />,
    children: [
      { path: 'admin', element: <LoginAdminPage />, index: true }
    ],
  },
  // Espace authentifié
  {
    path: '/app',
    element: <AuthOnlyLayout />,
    children: [
      {
        element: <Sidebar />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'companies', element: <AdminCompaniesPage /> },
          { path: 'companies/new', element: <AdminCreateCompanyPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])
