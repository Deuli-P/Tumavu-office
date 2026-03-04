import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Globe, Building2, Users, Briefcase,
  FileText, TrendingUp, CalendarDays, UserCheck,
} from 'lucide-react'
import type { AnnouncementStatus } from '@/types/annonce.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

// ── Types ──────────────────────────────────────────────────────────────────

interface StationDetail {
  id: number
  name: string
  country: { id: number; name: string; code: string }
  officeAddress: { street: string; number: string | null; locality: string; country: { name: string } }
  kpis: {
    companiesCount: number
    passagesThisWeek: number
    passagesThisMonth: number
    workersCount: number
  }
  companies: {
    id: string
    name: string
    type: string | null
    phone: string | null
    owner: { firstName: string; lastName: string }
    address: { locality: string; country: { name: string } }
    _count: { announcements: number; passages: number }
  }[]
  recentAnnouncements: {
    id: number
    title: string
    status: AnnouncementStatus | null
    createdAt: string
    job: { title: string } | null
    company: { name: string } | null
    _count: { applications: number }
  }[]
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE:    { label: 'Active',   color: 'bg-green-100 text-green-700' },
  CLOSED:    { label: 'Fermée',  color: 'bg-gray-100 text-gray-600' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── KPI card ────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ── Company card ─────────────────────────────────────────────────────────────

function CompanyCard({ company, onNavigate }: {
  company: StationDetail['companies'][number]
  onNavigate: (id: string) => void
}) {
  return (
    <div
      onClick={() => onNavigate(company.id)}
      className="rounded-xl border bg-white p-5 shadow-sm space-y-3 cursor-pointer hover:border-destructive/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <Building2 className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-semibold leading-tight">{company.name}</p>
            {company.type && (
              <p className="text-xs text-muted-foreground">{company.type}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {company.address.locality}, {company.address.country.name}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5 shrink-0" />
        Owner : {company.owner.firstName} {company.owner.lastName}
      </div>

      <div className="flex items-center gap-4 pt-1 border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {company._count.announcements} annonce{company._count.announcements > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          {company._count.passages} passage{company._count.passages > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function StationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<StationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${backendUrl}/station/${id}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">Station introuvable.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/app/stations')}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux stations
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <MapPin className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{detail.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {detail.country.name} ({detail.country.code})
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {detail.officeAddress.street}{detail.officeAddress.number ? ` ${detail.officeAddress.number}` : ''}, {detail.officeAddress.locality}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard
          icon={Building2}
          label="Companies"
          value={detail.kpis.companiesCount}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          icon={UserCheck}
          label="Travailleurs confirmés"
          value={detail.kpis.workersCount}
          color="bg-green-50 text-green-600"
        />
        <KpiCard
          icon={CalendarDays}
          label="Passages cette semaine"
          value={detail.kpis.passagesThisWeek}
          color="bg-orange-50 text-orange-600"
        />
        <KpiCard
          icon={TrendingUp}
          label="Passages ce mois"
          value={detail.kpis.passagesThisMonth}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Companies */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Companies ({detail.companies.length})
          </h2>
          {detail.companies.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aucune company rattachée.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {detail.companies.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  onNavigate={(cid) => navigate(`/app/companies/${cid}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Annonces récentes */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Annonces récentes
          </h2>
          {detail.recentAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aucune annonce.</p>
          ) : (
            <div className="space-y-3">
              {detail.recentAnnouncements.map((a) => {
                const statusStyle = a.status ? statusConfig[a.status] : null
                return (
                  <div
                    key={a.id}
                    onClick={() => navigate('/app/annonces')}
                    className="rounded-xl border bg-white p-4 shadow-sm space-y-2 cursor-pointer hover:border-destructive/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{a.title}</p>
                      {statusStyle && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.color}`}>
                          {statusStyle.label}
                        </span>
                      )}
                    </div>
                    {a.company && <p className="text-xs text-muted-foreground">{a.company.name}</p>}
                    {a.job && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />{a.job.title}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{a._count.applications} candidature{a._count.applications > 1 ? 's' : ''}
                      </span>
                      <span>{formatDate(a.createdAt)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
