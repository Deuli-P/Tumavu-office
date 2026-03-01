import { createBrowserRouter } from 'react-router-dom'
import { CompaniesPage } from '@/pages/companies/companies.page'
import { AdminCreateCompanyPage } from '@/pages/companies/create-company.page'
import { AdminUsersPage } from '@/pages/users/users.page'
import GuestOnlyLayout from './guest'
import AuthOnlyLayout from './logged'
import RootRedirect from './rootRedirect'
import { LoginPage } from '@/pages/auth/login/auth.page'
import { Sidebar } from '@/components/layout/Sidebar'
import { AdminDashboardPage } from '@/pages/dashboard/dashboard.page'
import CompaniePage from '@/pages/companies/companie.page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/auth/login',
    element: <GuestOnlyLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'admin', element: <LoginPage /> },
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
          { path: 'companies', element: <CompaniesPage /> },
          { path: 'companies/:id', element: <CompaniePage /> },
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
