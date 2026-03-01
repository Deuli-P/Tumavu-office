import { Link, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Briefcase, Users, File } from 'lucide-react'
import type { Company } from '@/types/company.types'
import { companies } from '@/data/companies'

const mockCompanies: Company[] = [
  { id: 'c1', name: 'Acme Corp', address: '12 Rue de Rivoli, 75001 Paris', description: 'Leader en solutions logistiques', ownerId: 'u1', ownerName: 'Jean Dupont', jobsCount: 12, usersCount: 8, createdAt: '2026-02-20' },
  { id: 'c2', name: 'TechFlow SAS', address: '8 Place Bellecour, 69002 Lyon', description: 'Startup SaaS B2B', ownerId: 'u2', ownerName: 'Claire Martin', jobsCount: 5, usersCount: 3, createdAt: '2026-02-18' },
  { id: 'c3', name: 'Medilab', address: '5 Cours de l\'Intendance, 33000 Bordeaux', description: 'Laboratoires d\'analyses médicales', ownerId: 'u3', ownerName: 'Pierre Bernard', jobsCount: 9, usersCount: 6, createdAt: '2026-02-15' },
  { id: 'c4', name: 'BuildSmart', address: '2 Quai de la Fosse, 44000 Nantes', description: 'Construction et BTP innovant', ownerId: 'u4', ownerName: 'Sophie Leclerc', jobsCount: 3, usersCount: 2, createdAt: '2026-02-10' },
  { id: 'c5', name: 'DataNest', address: 'Remote — France entière', description: 'Data engineering et BI', ownerId: 'u5', ownerName: 'Karim Benali', jobsCount: 7, usersCount: 5, createdAt: '2026-02-05' },
  { id: 'c6', name: 'GreenPulse', address: '27 Rue Saint-Ferréol, 13001 Marseille', description: 'Énergies renouvelables et RSE', ownerId: 'u6', ownerName: 'Amina Diallo', jobsCount: 4, usersCount: 3, createdAt: '2026-01-28' },
]

export function CompaniesPage() {

  const navigate= useNavigate();


  const handleNavigateToCompany = (companyId: string) => {
    // Logique de navigation vers la page de détails de la company
    console.log(`Navigating to company with ID: ${companyId}`);
    navigate(`/app/companies/${companyId}`);
  }


  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockCompanies.length} companies enregistrées</p>
        </div>
        <Link
          to="/app/companies/new"
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle company
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proprietaire</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Annonces</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jobs</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employés</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ajouté le</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-muted/30 transition-colors cursor-pointer"  onClick={() => handleNavigateToCompany(company.id)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-sm font-bold text-destructive shrink-0">
                      {company.name}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {company.address.city}, {company.address.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{company.owner.firstName.charAt(0)}. {company.owner.lastName}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <File className="h-3.5 w-3.5" />
                    {company.annoucments.length}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    {company.jobs.length}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {company.employes.length}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
