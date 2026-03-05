import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiSelect } from '@/components/ui/multi-select'
import { DateRangePicker, type DateRange } from '@/components/ui/date-range-picker'
import type { AdminUserItem } from '@/types/admin.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const roleConfig: Record<string, { color: string }> = {
  MANAGER: { color: 'bg-blue-100 text-blue-700' },
  USER: { color: 'bg-gray-100 text-gray-600' },
}

function formatDate(date?: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminUsersPage() {
  const { t } = useTranslation('users')
  const { t: tc } = useTranslation('common')
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [countryOptions, setCountryOptions] = useState<{ value: string | number; label: string }[]>([])

  // Filtres
  const [selectedCountries, setSelectedCountries] = useState<(string | number)[]>([])
  const [hasRole, setHasRole] = useState<string>('all')
  const [lastLogin, setLastLogin] = useState<DateRange>({ from: '', to: '' })

  // Charge les pays disponibles depuis les utilisateurs
  useEffect(() => {
    fetch(`${backendUrl}/users/admin/countries`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: string[]) =>
        setCountryOptions(data.filter(Boolean).map((c) => ({ value: c, label: c })))
      )
      .catch(() => {})
  }, [])

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    selectedCountries.forEach((c) => params.append('countries', String(c)))
    if (hasRole !== 'all') params.set('hasRole', hasRole)
    if (lastLogin.from) params.set('lastLoginFrom', lastLogin.from)
    if (lastLogin.to) params.set('lastLoginTo', lastLogin.to)

    fetch(`${backendUrl}/users/admin?${params}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [selectedCountries, hasRole, lastLogin])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const roleOptions = [
    { value: 'all', label: tc('role.all') },
    { value: 'owner', label: tc('role.owner') },
    { value: 'user', label: tc('role.user') },
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? tc('state.loading') : t('subtitle', { count: users.length })}
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-5">
        <MultiSelect
          options={countryOptions}
          selected={selectedCountries}
          onChange={setSelectedCountries}
          placeholder={tc('filter.byCountry')}
          className="w-56"
        />
        <div className="flex rounded-lg border bg-white overflow-hidden text-sm">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setHasRole(opt.value)}
              className={`px-3 py-1.5 transition-colors ${
                hasRole === opt.value
                  ? 'bg-destructive text-white font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <DateRangePicker
          value={lastLogin}
          onChange={setLastLogin}
          label={tc('filter.lastLogin')}
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.user')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.role')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.country')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.company')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.createdAt')}</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('table.lastLogin')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">{tc('state.loading')}</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('noUsers')}</td></tr>
            )}
            {users.map((user) => {
              const roleStyle = roleConfig[user.role.type] ?? { color: 'bg-gray-100 text-gray-600' }
              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle.color}`}>
                      {tc(`role.${user.role.type}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.country?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.company?.name ?? <span className="italic opacity-50">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.lastLoginAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
