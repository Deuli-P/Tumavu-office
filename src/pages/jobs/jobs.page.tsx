import { Link } from 'react-router-dom'
import { MapPin, Users, Plus } from 'lucide-react'

const mockJobs = [
  { id: '1', title: 'Développeur React Senior', location: 'Paris (Hybride)', contractType: 'CDI', applications: 24, status: 'active', createdAt: '2026-01-15' },
  { id: '2', title: 'Designer UX/UI', location: 'Lyon', contractType: 'CDI', applications: 18, status: 'active', createdAt: '2026-01-20' },
  { id: '3', title: 'Chef de projet digital', location: 'Remote', contractType: 'CDD', applications: 11, status: 'active', createdAt: '2026-02-01' },
  { id: '4', title: 'Data Analyst', location: 'Bordeaux', contractType: 'Stage', applications: 7, status: 'draft', createdAt: '2026-02-10' },
  { id: '5', title: 'DevOps Engineer', location: 'Paris', contractType: 'CDI', applications: 5, status: 'closed', createdAt: '2025-12-01' },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  closed: { label: 'Fermé', color: 'bg-red-100 text-red-700' },
}

export function JobsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Annonces</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockJobs.length} annonce{mockJobs.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link
          to="/app/jobs/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle annonce
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm divide-y">
        {mockJobs.map((job) => (
          <Link
            key={job.id}
            to={`/app/jobs/${job.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-medium text-sm">{job.title}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${statusConfig[job.status].color}`}>
                  {statusConfig[job.status].label}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                <span>{job.contractType}</span>
                <span>Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-4 shrink-0">
              <Users className="h-4 w-4" />
              <span>{job.applications}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
