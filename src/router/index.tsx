import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/login.page'
import { RegisterPage } from '@/pages/auth/register.page'
import { DashboardPage } from '@/pages/dashboard/dashboard.page'
import { JobsPage } from '@/pages/jobs/jobs.page'
import { CreateJobPage } from '@/pages/jobs/create-job.page'
import { JobDetailPage } from '@/pages/jobs/job-detail.page'
import { BenefitsPage } from '@/pages/benefits/benefits.page'
import { CreateBenefitPage } from '@/pages/benefits/create-benefit.page'
import { AdminDashboardPage } from '@/pages/admin/dashboard.page'
import { AdminCompaniesPage } from '@/pages/admin/companies/companies.page'
import { AdminCreateCompanyPage } from '@/pages/admin/companies/create-company.page'
import { AdminUsersPage } from '@/pages/admin/users/users.page'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import GuestOnlyLayout from './guest'
import AuthOnlyLayout from './logged'
import AdminOnlyLayout from './admin'
import RootRedirect from './rootRedirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/auth',
    element: <GuestOnlyLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  // Espace entreprise
  {
    path: '/app',
    element: <AuthOnlyLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'jobs', element: <JobsPage /> },
          { path: 'jobs/new', element: <CreateJobPage /> },
          { path: 'jobs/:id', element: <JobDetailPage /> },
          { path: 'benefits', element: <BenefitsPage /> },
          { path: 'benefits/new', element: <CreateBenefitPage /> },
        ],
      },
    ],
  },
  // Espace super-admin
  {
    path: '/admin',
    element: <AdminOnlyLayout />,
    children: [
      {
        element: <AdminLayout />,
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
