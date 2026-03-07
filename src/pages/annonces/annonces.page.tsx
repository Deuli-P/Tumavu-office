import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import type { AnnouncementListItem } from '@/types/annonce.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AnnoncesPage() {
  const { t } = useTranslation('annonces')
  const { t: tc } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${backendUrl}/annonce`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setAnnouncements(Array.isArray(d) ? d : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? tc('state.loading') : t('subtitle', { count: announcements.length })}
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.title')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.description')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.publishedAt')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{tc('state.loading')}</td>
              </tr>
            )}
            {!loading && announcements.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('noAnnouncements')}</td>
              </tr>
            )}
            {announcements.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <FileText className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="font-medium">{a.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                  {a.description ?? '—'}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(a.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
