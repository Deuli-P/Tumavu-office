import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Phone, User, Briefcase, Users, TrendingUp } from 'lucide-react'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type Tag = { id: number; name: string }

type CompanyDetail = {
  id: string
  name: string
  description: string | null
  type: string | null
  phone: string | null
  createdAt: string
  address: { street: string; number: string | null; locality: string; country: { name: string; code: string } }
  station: { id: number; name: string }
  owner: { id: string; firstName: string; lastName: string; email: string }
  jobs: {
    id: number
    title: string
    contractType: string | null
    status: string | null
    tags: Tag[]
    _count: { announcements: number }
  }[]
  announcements: {
    id: number
    title: string
    status: string | null
    createdAt: string
    jobTitle: string | null
    _count: { applications: number }
  }[]
  kpis: { passagesWeek: number; passagesMonth: number }
}

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}

const contractColor: Record<string, string> = {
  CDD: 'bg-blue-100 text-blue-700',
  CDI: 'bg-green-100 text-green-700',
  FREELANCE: 'bg-purple-100 text-purple-700',
  STAGE: 'bg-yellow-100 text-yellow-700',
  RESORT: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-gray-100 text-gray-600',
}

export default function CompaniePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('companies')
  const { t: tc } = useTranslation('common')
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { navigate('/app/companies'); return }
    fetch(`${backendUrl}/company/admin/${id}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { navigate('/app/companies'); return }
        setCompany(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">{tc('state.loading')}</div>
  }

  if (!company) return null

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-GB'

  return (
    <div className="p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/app/companies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('detail.back')}
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            {company.description && (
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{company.description}</p>
            )}
          </div>
          {company.type && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {company.type}
            </span>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={<User className="h-4 w-4" />} label={t('detail.owner')}>
          <p className="font-medium">{company.owner.firstName} {company.owner.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{company.owner.email}</p>
        </InfoCard>
        <InfoCard icon={<MapPin className="h-4 w-4" />} label={t('detail.station')}>
          <p className="font-medium">{company.station.name}</p>
        </InfoCard>
        <InfoCard icon={<Building2 className="h-4 w-4" />} label={t('detail.address')}>
          <p className="font-medium">{company.address.locality}</p>
          <p className="text-xs text-muted-foreground">{company.address.street}{company.address.number ? ` ${company.address.number}` : ''}</p>
        </InfoCard>
        {company.phone && (
          <InfoCard icon={<Phone className="h-4 w-4" />} label={t('detail.phone')}>
            <p className="font-medium">{company.phone}</p>
          </InfoCard>
        )}
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard label={t('detail.passagesWeek')} value={company.kpis.passagesWeek} icon={<TrendingUp className="h-5 w-5 text-blue-500" />} />
        <KpiCard label={t('detail.passagesMonth')} value={company.kpis.passagesMonth} icon={<TrendingUp className="h-5 w-5 text-green-500" />} />
      </div>

      {/* Jobs */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('detail.jobs')} ({company.jobs.length})
        </h2>
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {company.jobs.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground text-center">{t('detail.noJobs')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.contract')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.tags')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.applications')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {company.jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{job.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {job.contractType ? (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${contractColor[job.contractType] ?? 'bg-gray-100 text-gray-600'}`}>
                          {job.contractType}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map((tag) => (
                          <span key={tag.id} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                            {tag.name}
                          </span>
                        ))}
                        {job.tags.length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {job._count.announcements}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Announcements */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('detail.announcements')} ({company?.announcements?.length ?? 0})
        </h2>
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {company?.announcements?.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground text-center">{t('detail.noAnnouncements')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.job')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.applications')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('detail.table.postedAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {company?.announcements?.map((ann) => (
                  <tr key={ann.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{ann.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{ann.jobTitle ?? '—'}</td>
                    <td className="px-6 py-4">
                      {ann.status ? (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[ann.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {tc(`status.${ann.status}`)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {ann._count.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(ann.createdAt).toLocaleDateString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}

function KpiCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      {icon}
    </div>
  )
}
