import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Tag as TagIcon } from 'lucide-react'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type TagItem = {
  id: number
  name: string
  _count: { jobs: number }
}

export function TagsPage() {
  const { t } = useTranslation('tags')
  const { t: tc } = useTranslation('common')
  const [tags, setTags] = useState<TagItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  async function load() {
    const res = await fetch(`${backendUrl}/tag`, { credentials: 'include' })
    const data = res.ok ? await res.json() : []
    setTags(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    if (!newName.trim()) return
    setCreating(true)
    const res = await fetch(`${backendUrl}/tag`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setCreating(false)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setCreateError(res.status === 409 ? t('error.duplicate') : (err.message ?? t('error.generic')))
      return
    }
    setNewName('')
    load()
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await fetch(`${backendUrl}/tag/${id}`, { method: 'DELETE', credentials: 'include' })
    setDeleting(null)
    load()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('list.title')} ({tags.length})
        </h2>

        {/* Create form */}
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('create.placeholder')}
            className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('create.button')}
          </button>
        </form>
        {createError && <p className="text-xs text-destructive">{createError}</p>}

        {/* Tags list */}
        <div className="rounded-xl border bg-white shadow-sm divide-y overflow-hidden">
          {loading && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">{tc('state.loading')}</p>
          )}
          {!loading && tags.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">{t('list.empty')}</p>
          )}
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <TagIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tag.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('jobs', { count: tag._count.jobs })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(tag.id)}
                disabled={deleting === tag.id}
                className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 p-1"
                title={t('deleteConfirm')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
