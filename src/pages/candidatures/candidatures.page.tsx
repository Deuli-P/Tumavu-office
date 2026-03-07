import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type ApplicationItem = {
  id: number
  status: string | null
  createdAt: string
  user: { id: string; firstName: string; lastName: string; auth: { email: string } | null }
  offer: {
    id: number
    title: string
    company: { id: string; name: string; station: { id: number; name: string } | null } | null
  }
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
  INTERVIEW: 'bg-blue-100 text-blue-700',
  TEST: 'bg-purple-100 text-purple-700',
  PHONE: 'bg-orange-100 text-orange-700',
}

const APPLICATION_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'INTERVIEW', 'TEST', 'PHONE']

export function CandidaturesPage() {
  const { t, i18n } = useTranslation('candidatures')
  const { t: tc } = useTranslation('common')
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  async function load(status: string) {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    const res = await fetch(`${backendUrl}/job-offer/admin/applications?${params}`, {
      credentials: 'include',
    })
    const data = res.ok ? await res.json() : []
    setApplications(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load(statusFilter) }, [statusFilter])

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-GB'

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('subtitle', { count: applications.length })}
          </p>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        >
          <option value="">{t('filter.all')}</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{tc(`appStatus.${s}`)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="px-6 py-8 text-sm text-muted-foreground text-center">{tc('state.loading')}</p>
        ) : applications.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground text-center">{t('noResults')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.candidate')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.offer')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.company')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.station')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{app.user.firstName} {app.user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{app.user.auth?.email ?? ''}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{app.offer.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{app.offer.company?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{app.offer.company?.station?.name ?? '—'}</td>
                  <td className="px-6 py-4">
                    {app.status ? (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {tc(`appStatus.${app.status}`)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
