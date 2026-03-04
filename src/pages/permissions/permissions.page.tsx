import { useEffect, useState } from 'react'
import { Plus, X, ShieldCheck } from 'lucide-react'
import type { PermissionItem, RoleWithPermissions } from '@/types/admin.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const roleTypeColor: Record<string, string> = {
  ADMIN: 'bg-destructive/10 text-destructive',
  MANAGER: 'bg-blue-100 text-blue-700',
  USER: 'bg-gray-100 text-gray-600',
}

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [roles, setRoles] = useState<RoleWithPermissions[]>([])
  const [loading, setLoading] = useState(true)
  const [newValue, setNewValue] = useState('')
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null) // `${roleId}-${permissionId}`

  async function load() {
    const [p, r] = await Promise.all([
      fetch(`${backendUrl}/permission`, { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
      fetch(`${backendUrl}/permission/roles`, { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
    ])
    setPermissions(Array.isArray(p) ? p : [])
    setRoles(Array.isArray(r) ? r : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    if (!newValue.trim()) return
    setCreating(true)
    const res = await fetch(`${backendUrl}/permission`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newValue.trim() }),
    })
    setCreating(false)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setCreateError(res.status === 409 ? 'Cette permission existe déjà.' : (err.message ?? 'Erreur'))
      return
    }
    setNewValue('')
    load()
  }

  async function handleAssign(roleId: number, permissionId: number) {
    const key = `${roleId}-${permissionId}`
    setAssigning(key)
    await fetch(`${backendUrl}/permission/role/${roleId}/permission/${permissionId}`, {
      method: 'POST',
      credentials: 'include',
    })
    setAssigning(null)
    load()
  }

  async function handleRemove(roleId: number, permissionId: number) {
    const key = `${roleId}-${permissionId}`
    setAssigning(key)
    await fetch(`${backendUrl}/permission/role/${roleId}/permission/${permissionId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    setAssigning(null)
    load()
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez les permissions et leur attribution aux rôles.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Liste des permissions ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Permissions ({permissions.length})
          </h2>

          {/* Formulaire création */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="ex. read:announcements"
              className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground font-mono"
            />
            <button
              type="submit"
              disabled={creating || !newValue.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Créer
            </button>
          </form>
          {createError && <p className="text-xs text-destructive">{createError}</p>}

          {/* Liste */}
          <div className="rounded-xl border bg-white shadow-sm divide-y overflow-hidden">
            {loading && <p className="px-4 py-6 text-sm text-muted-foreground text-center">Chargement...</p>}
            {!loading && permissions.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Aucune permission.</p>
            )}
            {permissions.map((perm) => (
              <div key={perm.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-mono text-sm font-medium">{perm.value}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {perm.roles.map((r) => (
                      <span key={r.id} className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleTypeColor[r.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {r.value}
                      </span>
                    ))}
                    {perm.roles.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Aucun rôle</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5">#{perm.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rôles & assignation ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Rôles & assignation
          </h2>

          {roles.map((role) => {
            const assignedIds = new Set(role.permissions.map((p) => p.id))
            const unassigned = permissions.filter((p) => !assignedIds.has(p.id))

            return (
              <div key={role.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className={`flex items-center gap-2 px-4 py-3 border-b ${roleTypeColor[role.type] ?? 'bg-gray-50'}`}>
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold text-sm">{role.value}</span>
                  <span className="ml-auto text-xs opacity-70">{role.type}</span>
                </div>

                {/* Permissions assignées */}
                <div className="px-4 py-3 space-y-1.5 min-h-[48px]">
                  {role.permissions.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Aucune permission assignée.</p>
                  )}
                  {role.permissions.map((perm) => {
                    const key = `${role.id}-${perm.id}`
                    return (
                      <div key={perm.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs">
                        <span className="font-mono">{perm.value}</span>
                        <button
                          onClick={() => handleRemove(role.id, perm.id)}
                          disabled={assigning === key}
                          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Ajouter une permission */}
                {unassigned.length > 0 && (
                  <div className="border-t px-4 py-3">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssign(role.id, Number(e.target.value))
                          e.target.value = ''
                        }
                      }}
                      className="w-full rounded-lg border bg-white px-3 py-1.5 text-xs outline-none ring-ring focus:ring-2 font-mono"
                    >
                      <option value="">+ Ajouter une permission...</option>
                      {unassigned.map((p) => (
                        <option key={p.id} value={p.id}>{p.value}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
