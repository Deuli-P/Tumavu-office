import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, ExternalLink, Mail, FileText } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import type { JobApplication } from '@/types/job.types'

// Mock data
const mockJob = {
  id: '1',
  title: 'Développeur React Senior',
  description:
    'Nous recherchons un développeur React expérimenté pour rejoindre notre équipe produit. Vous travaillerez sur des applications web modernes, collaborerez avec les designers et contribuerez aux décisions architecturales.\n\nMissions principales :\n• Développer de nouvelles fonctionnalités en React/TypeScript\n• Participer aux revues de code et aux décisions techniques\n• Contribuer à l\'amélioration continue de notre stack',
  location: 'Paris (Hybride)',
  contractType: 'CDI',
  salary: '50 000 € – 65 000 € / an',
  status: 'active',
  createdAt: '2026-01-15',
}

const mockApplications: (JobApplication & { phone?: string; skills?: string[] })[] = [
  {
    id: 'a1',
    jobId: '1',
    jobTitle: 'Développeur React Senior',
    applicantName: 'Sophie Martin',
    applicantEmail: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    resumeUrl: 'https://example.com/cv-sophie-martin.pdf',
    coverLetter:
      'Passionnée par le développement frontend depuis 5 ans, j\'ai travaillé chez plusieurs startups et scale-ups parisiens. Mon expérience avec React, TypeScript et les architectures modernes correspond parfaitement à ce que vous recherchez.',
    status: 'pending',
    appliedAt: '2026-02-10',
    skills: ['React', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
  },
  {
    id: 'a2',
    jobId: '1',
    jobTitle: 'Développeur React Senior',
    applicantName: 'Karim Benali',
    applicantEmail: 'karim.benali@email.com',
    phone: '+33 7 98 76 54 32',
    resumeUrl: 'https://example.com/cv-karim-benali.pdf',
    coverLetter:
      '7 ans d\'expérience en développement web, dont 4 en React. J\'ai dirigé des équipes frontend et mis en place des bonnes pratiques de qualité logicielle. Très intéressé par votre projet.',
    status: 'reviewed',
    appliedAt: '2026-02-12',
    skills: ['React', 'Next.js', 'Node.js', 'AWS'],
  },
  {
    id: 'a3',
    jobId: '1',
    jobTitle: 'Développeur React Senior',
    applicantName: 'Léa Dupont',
    applicantEmail: 'lea.dupont@email.com',
    phone: '+33 6 55 44 33 22',
    resumeUrl: 'https://example.com/cv-lea-dupont.pdf',
    coverLetter:
      'Développeuse fullstack avec une forte appétence pour le frontend. J\'ai récemment migré une application Angular vers React, ce qui m\'a permis de maîtriser l\'écosystème en profondeur.',
    status: 'accepted',
    appliedAt: '2026-02-14',
    skills: ['React', 'Vue.js', 'Python', 'Docker'],
  },
  {
    id: 'a4',
    jobId: '1',
    jobTitle: 'Développeur React Senior',
    applicantName: 'Thomas Leclerc',
    applicantEmail: 'thomas.leclerc@email.com',
    phone: '+33 6 11 22 33 44',
    resumeUrl: undefined,
    coverLetter: 'Développeur junior motivé, cherchant à progresser dans un environnement stimulant.',
    status: 'rejected',
    appliedAt: '2026-02-18',
    skills: ['React', 'JavaScript'],
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-orange-100 text-orange-700' },
  reviewed: { label: 'Examiné', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepté', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
}

const jobStatusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  closed: { label: 'Fermé', color: 'bg-red-100 text-red-700' },
}

type ApplicationWithExtras = (typeof mockApplications)[number]

export function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicationWithExtras | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // In real app: fetch by id
  const job = mockJob
  const applications = mockApplications

  const filtered =
    statusFilter === 'all' ? applications : applications.filter((a) => a.status === statusFilter)

  return (
    <div className="p-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux annonces
      </button>

      {/* Job info card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">{job.title}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${jobStatusConfig[job.status].color}`}>
                {jobStatusConfig[job.status].label}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{job.contractType}</span>
              {job.salary && <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{applications.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">candidature{applications.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {/* Candidats */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Candidats ({filtered.length})</h2>
          {/* Filter */}
          <div className="flex gap-1">
            {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {f === 'all' ? 'Tous' : statusConfig[f].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Aucun candidat pour ce filtre
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedCandidate(app)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors text-left"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                    {app.applicantName.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{app.applicantName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.applicantEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-xs text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                  </p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[app.status].color}`}>
                    {statusConfig[app.status].label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer candidat */}
      <Sheet
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title="Dossier candidat"
      >
        {selectedCandidate && <CandidateDetail candidate={selectedCandidate} />}
      </Sheet>
    </div>
  )
}

function CandidateDetail({ candidate }: { candidate: ApplicationWithExtras }) {
  return (
    <div className="space-y-6">
      {/* Identité */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
          {candidate.applicantName.split(' ').map((n) => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-base">{candidate.applicantName}</h3>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[candidate.status].color}`}>
            {statusConfig[candidate.status].label}
          </span>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="rounded-xl bg-muted/50 p-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Coordonnées</h4>
        <div className="flex items-center gap-2.5 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <a href={`mailto:${candidate.applicantEmail}`} className="hover:underline text-primary">
            {candidate.applicantEmail}
          </a>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="h-4 w-4 text-muted-foreground shrink-0 text-center text-xs">📞</span>
            <span>{candidate.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>Candidature du {new Date(candidate.appliedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Compétences */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Compétences</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span key={skill} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lettre de motivation */}
      {candidate.coverLetter && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Lettre de motivation</h4>
          <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground leading-relaxed">
            {candidate.coverLetter}
          </div>
        </div>
      )}

      {/* CV */}
      <div className="pt-2">
        {candidate.resumeUrl ? (
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Ouvrir le CV
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4" />
            Aucun CV joint
          </div>
        )}
      </div>
    </div>
  )
}
