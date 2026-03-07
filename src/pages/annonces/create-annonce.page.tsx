import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type AttachmentRow = { filename: string; url: string }

const STATUSES = ['DRAFT', 'PUBLISHED', 'DELETED'] as const

export function CreateAnnoncePage() {
  const navigate = useNavigate()
  const { t } = useTranslation('annonces')
  const { t: tc } = useTranslation('common')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<typeof STATUSES[number]>('DRAFT')
  const [publishedAt, setPublishedAt] = useState('')
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function addRow() {
    setAttachments((prev) => [...prev, { filename: '', url: '' }])
  }

  function removeRow(i: number) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: keyof AttachmentRow, value: string) {
    setAttachments((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setApiError(null)
    try {
      const validAttachments = attachments.filter((a) => a.filename.trim() && a.url.trim())
      const res = await fetch(`${backendUrl}/annonce`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          publishedAt: publishedAt || undefined,
          attachments: validAttachments.length > 0 ? validAttachments : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? 'Erreur'))
      }
      navigate('/app/annonces')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {tc('actions.back')}
      </button>

      <h1 className="text-2xl font-bold">{t('create.title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('create.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">

        {/* Titre */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.fields.title')} <span className="text-destructive">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex. Fermeture plateforme le 25 décembre"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.fields.description')}
            <span className="ml-1 text-xs font-normal text-muted-foreground">({tc('actions.optionnal')})</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Décrivez le contenu de l'annonce..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Statut + Date de publication */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('create.fields.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof STATUSES[number])}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ring-ring"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{t(`status.${s}`)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {t('create.fields.publishedAt')}
              <span className="ml-1 text-xs font-normal text-muted-foreground">({tc('actions.optionnal')})</span>
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ring-ring"
            />
          </div>
        </div>

        {/* Pièces jointes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('create.fields.attachments')}
            <span className="ml-1 text-xs font-normal text-muted-foreground">({tc('actions.optionnal')})</span>
          </label>

          {attachments.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{t('create.fields.filename')}</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{t('create.fields.url')}</th>
                    <th className="px-3 py-2 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attachments.map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <input
                          value={row.filename}
                          onChange={(e) => updateRow(i, 'filename', e.target.value)}
                          placeholder="rapport.pdf"
                          className="w-full rounded border bg-white px-2 py-1 text-sm outline-none focus:ring-1 ring-ring placeholder:text-muted-foreground"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={row.url}
                          onChange={(e) => updateRow(i, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded border bg-white px-2 py-1 text-sm outline-none focus:ring-1 ring-ring placeholder:text-muted-foreground"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={addRow}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('create.addAttachment')}
          </button>
        </div>

        {apiError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {t('create.cancel')}
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="flex-1 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {submitting ? t('create.submitting') : t('create.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
