import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Users, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

const navItemsCompany = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/companie', label: "L'entreprise", icon: Building2 },
  { to: '/app/jobs', label: 'Emplois', icon: Users },
]

const navItemsAdmin = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
];


export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  
  const navItems = user?.info?.role?.type === 'ADMIN' ? navItemsAdmin : navItemsCompany
  
  function handleLogout() {
    logout()
    navigate('/auth/login/choice')
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-white">
      {/* Logo + badge admin */}
      <div className="flex flex-col gap-1.5 px-6 py-5 border-b">
        <div className="flex items-center gap-2">
            { user?.info?.role?.type === 'ADMIN' ? 
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
              <ShieldCheck className="h-4 w-4 text-white" /> 
          </div>
            :
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-white" />
            </div>
            }

          <span className="text-lg font-bold tracking-tight">Tumavu</span>
        </div>
        {user?.info?.role?.type === 'ADMIN' && (
          <span className="ml-10 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-destructive">
            Super Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-destructive/10 text-destructive'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t px-3 py-4">
        <div className="mb-2 px-3">
          <p className="text-xs font-medium">{user?.info.firstName} {user?.info.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.info.email ?? ''}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
