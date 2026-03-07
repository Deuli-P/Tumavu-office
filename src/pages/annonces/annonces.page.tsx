import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Paperclip, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AnnouncementListItem, AnnouncementStatus } from '@/types/annonce.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const STATUSES: AnnouncementStatus[] = ['DRAFT', 'PUBLISHED', 'DELETED']

const statusColor: Record<AnnouncementStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PUBLISHED: 'bg-green-100 text-green-700',
  DELETED: 'bg-red-100 text-red-600',
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AnnoncesPage() {
  const { t, i18n } = useTranslation('annonces')
  const { t: tc } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<AnnouncementStatus | ''>('')

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-GB'

  function load(status: AnnouncementStatus | '') {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    fetch(`${backendUrl}/annonce?${params}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setAnnouncements(Array.isArray(d) ? d : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(statusFilter) }, [statusFilter])

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? tc('state.loading') : t('subtitle', { count: announcements.length })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AnnouncementStatus | '')}
            className="rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">{t('filter.all')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </select>

          <Link
            to="/app/annonces/new"
            className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('new')}
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.title')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.status')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.publishedAt')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.creator')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.attachments')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">{tc('state.loading')}</td>
              </tr>
            )}
            {!loading && announcements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('noAnnouncements')}</td>
              </tr>
            )}
            {announcements.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <FileText className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">{a.title}</p>
                      {a.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{a.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
                    {t(`status.${a.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(a.publishedAt)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {a.creator.firstName} {a.creator.lastName}
                </td>
                <td className="px-6 py-4">
                  {a.attachments.length > 0 ? (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Paperclip className="h-3.5 w-3.5" />
                      {a.attachments.length}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString(locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
