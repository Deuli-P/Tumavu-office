import { createBrowserRouter } from 'react-router-dom'
import  CompaniesPage  from '@/pages/companies/companies.page'
import { AdminCreateCompanyPage } from '@/pages/companies/create-company.page'
import { AdminUsersPage } from '@/pages/users/users.page'
import { StationsPage } from '@/pages/stations/stations.page'
import { CreateStationPage } from '@/pages/stations/create-station.page'
import { StationDetailPage } from '@/pages/stations/station-detail.page'
import { PermissionsPage } from '@/pages/permissions/permissions.page'
import { AnnoncesPage } from '@/pages/annonces/annonces.page'
import { CreateAnnoncePage } from '@/pages/annonces/create-annonce.page'
import { TagsPage } from '@/pages/tags/tags.page'
import { CandidaturesPage } from '@/pages/candidatures/candidatures.page'
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
          { path: 'stations', element: <StationsPage /> },
          { path: 'stations/new', element: <CreateStationPage /> },
          { path: 'stations/:id', element: <StationDetailPage /> },
          { path: 'permissions', element: <PermissionsPage /> },
          { path: 'annonces', element: <AnnoncesPage /> },
          { path: 'annonces/new', element: <CreateAnnoncePage /> },
          { path: 'tags', element: <TagsPage /> },
          { path: 'candidatures', element: <CandidaturesPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])
