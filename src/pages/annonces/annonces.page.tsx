import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Users, Briefcase, Building2, MapPin, Phone, Calendar, Tag } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { MultiSelect } from '@/components/ui/multi-select'
import { useUtils } from '@/store/utils.store'
import type { AnnouncementListItem, AnnouncementDetail, ApplicationStatus } from '@/types/annonce.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

// ── Statuts ────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  ACTIVE:    'bg-green-100 text-green-700',
  CLOSED:    'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}

const appStatusColor: Record<ApplicationStatus, string> = {
  CONFIRMED:  'bg-green-100 text-green-700',
  REFUSED:    'bg-red-100 text-red-600',
  INTERVIEW:  'bg-blue-100 text-blue-700',
  SIGNATURE:  'bg-purple-100 text-purple-700',
  CANCELLED:  'bg-gray-100 text-gray-500',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Composant card postulant ───────────────────────────────────────────────

function ApplicantCard({ app }: { app: AnnouncementDetail['applications'][number] }) {
  const { t: tc } = useTranslation('common')
  const { t } = useTranslation('annonces')
  const initials = `${app.user.firstName[0]}${app.user.lastName[0]}`.toUpperCase()
  const color = app.status ? appStatusColor[app.status] : null

  return (
    <div className="rounded-xl border bg-white p-4 space-y-2 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">
              {app.user.firstName} {app.user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{app.user.auth.email}</p>
          </div>
        </div>
        {color && app.status && (
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
            {tc(`appStatus.${app.status}`)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
        {app.user.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />{app.user.phone}
          </span>
        )}
        {app.user.country && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{app.user.country.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />{t('drawer.appliedOn', { date: formatDate(app.createdAt) })}
        </span>
      </div>
    </div>
  )
}

// ── Contenu du drawer ──────────────────────────────────────────────────────

function AnnouncementDrawer({ id, onClose }: { id: number; onClose: () => void }) {
  const [detail, setDetail] = useState<AnnouncementDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${backendUrl}/annonce/admin/${id}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Sheet open onClose={onClose} title="Annonce">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </Sheet>
    )
  }

  if (!detail) {
    return (
      <Sheet open onClose={onClose} title="Annonce">
        <p className="text-sm text-destructive">Impossible de charger l'annonce.</p>
      </Sheet>
    )
  }

  const { t } = useTranslation('annonces')
  const { t: tc } = useTranslation('common')
  const statusColor2 = detail.status ? statusColor[detail.status] : null

  return (
    <Sheet open onClose={onClose} title={detail.title}>
      <div className="space-y-6">

        {/* Statut + dates */}
        <div className="flex flex-wrap items-center gap-3">
          {statusColor2 && detail.status && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor2}`}>
              {tc(`status.${detail.status}`)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {t('drawer.publishedOn', { date: formatDate(detail.createdAt) })}
          </span>
        </div>

        {/* Description */}
        {detail.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{detail.description}</p>
        )}

        {/* Job */}
        {detail.job && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              {detail.job.title}
            </div>
            {detail.job.contractType && (
              <p className="text-xs text-muted-foreground pl-6">{detail.job.contractType}</p>
            )}
          </div>
        )}

        {/* Company */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {detail.company.name}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground pl-6">
            <MapPin className="h-3 w-3" />
            {detail.company.address.locality}, {detail.company.address.country.name}
          </p>
          {detail.company.phone && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground pl-6">
              <Phone className="h-3 w-3" />{detail.company.phone}
            </p>
          )}
        </div>

        {/* Postulants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">
              {t('drawer.applicants', { count: detail.applications.length })}
            </h3>
          </div>

          {detail.applications.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">{t('drawer.noApplicants')}</p>
          ) : (
            <div className="space-y-2">
              {detail.applications.map((app) => (
                <ApplicantCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  )
}

// ── Page principale ────────────────────────────────────────────────────────

export function AnnoncesPage() {
  const { t } = useTranslation('annonces')
  const { t: tc } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [tagOptions, setTagOptions] = useState<{ value: string | number; label: string }[]>([])
  const [selectedStations, setSelectedStations] = useState<(string | number)[]>([])
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>([])

  const stations = useUtils((s) => s.stations)
  const stationOptions = stations.map((s) => ({ value: s.id, label: s.name }))

  useEffect(() => {
    fetch(`${backendUrl}/annonce/admin/tags`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : [])
      .then((d: { id: number; name: string }[]) =>
        setTagOptions(Array.isArray(d) ? d.map((t) => ({ value: t.id, label: t.name })) : [])
      )
      .catch(() => {})
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    selectedStations.forEach((s) => params.append('stationIds', String(s)))
    selectedTags.forEach((t) => params.append('tagIds', String(t)))
    fetch(`${backendUrl}/annonce/admin?${params}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setAnnouncements(Array.isArray(d) ? d : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false))
  }, [selectedStations, selectedTags])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? tc('state.loading') : t('subtitle', { count: announcements.length })}
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-5">
        <MultiSelect
          options={stationOptions}
          selected={selectedStations}
          onChange={setSelectedStations}
          placeholder={tc('filter.byStation')}
          className="w-52"
        />
        <MultiSelect
          options={tagOptions}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder={tc('filter.byTag')}
          className="w-52"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.title')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.job')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.tags')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.company')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.station')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.status')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.publishedAt')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.applications')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-muted-foreground">{tc('state.loading')}</td>
              </tr>
            )}
            {!loading && announcements.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('noAnnouncements')}</td>
              </tr>
            )}
            {announcements.map((a) => {
              const color = a.status ? statusColor[a.status] : null
              const tags = a.job?.tags ?? []
              return (
                <tr
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                        <FileText className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="font-medium">{a.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {a.job ? (
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        {a.job.title}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {tags.map(({ tag }) => (
                          <span key={tag.id} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            <Tag className="h-2.5 w-2.5" />{tag.name}
                          </span>
                        ))}
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {a.company.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {a.company.station ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {a.company.station.name}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {color && a.status ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
                        {tc(`status.${a.status}`)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(a.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {a._count.applications}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedId !== null && (
        <AnnouncementDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
