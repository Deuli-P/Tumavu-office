import type { AdminUser } from '@/types/admin.types'

const mockUsers: AdminUser[] = [
  { id: 'u1', name: 'Jean Dupont', email: 'jean.dupont@email.com', role: 'owner', companyName: 'Acme Corp', createdAt: '2026-01-01', lastLoginAt: '2026-02-27' },
  { id: 'u2', name: 'Claire Martin', email: 'claire.martin@email.com', role: 'owner', companyName: 'TechFlow SAS', createdAt: '2026-01-05', lastLoginAt: '2026-02-26' },
  { id: 'u3', name: 'Pierre Bernard', email: 'pierre.bernard@email.com', role: 'admin', companyName: 'Medilab', createdAt: '2026-01-10', lastLoginAt: '2026-02-25' },
  { id: 'u4', name: 'Sophie Leclerc', email: 'sophie.leclerc@email.com', role: 'owner', companyName: 'BuildSmart', createdAt: '2026-01-15', lastLoginAt: '2026-02-24' },
  { id: 'u5', name: 'Karim Benali', email: 'karim.benali@email.com', role: 'owner', companyName: 'DataNest', createdAt: '2026-01-20', lastLoginAt: '2026-02-22' },
  { id: 'u6', name: 'Amina Diallo', email: 'amina.diallo@email.com', role: 'admin', companyName: 'GreenPulse', createdAt: '2026-01-25', lastLoginAt: '2026-02-20' },
  { id: 'u7', name: 'Lucas Petit', email: 'lucas.petit@email.com', role: 'admin', companyName: 'Acme Corp', createdAt: '2026-02-01', lastLoginAt: '2026-02-18' },
  { id: 'u8', name: 'Emma Rousseau', email: 'emma.rousseau@email.com', role: 'admin', companyName: 'TechFlow SAS', createdAt: '2026-02-05', lastLoginAt: '2026-02-15' },
  { id: 'u9', name: 'Admin Système', email: 'admin@tumavu.com', role: 'ADMIN', companyName: undefined, createdAt: '2025-06-01', lastLoginAt: '2026-02-28' },
]

const roleConfig: Record<string, { label: string; color: string }> = {
  owner: { label: 'Owner', color: 'bg-blue-100 text-blue-700' },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  ADMIN: { label: 'Super Admin', color: 'bg-destructive/10 text-destructive' },
}

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminUsersPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground mt-1">{mockUsers.length} utilisateurs enregistrés</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inscrit le</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dernière connexion</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockUsers.map((user) => {
              const role = roleConfig[user.role]
              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                        {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${role.color}`}>
                      {role.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.companyName ?? <span className="italic text-muted-foreground/50">—</span>}
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
