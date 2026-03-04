import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Users, LogOut, ShieldCheck, MapPin, KeyRound, Megaphone } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useUtils } from '@/store/utils.store'
import { cn } from '@/lib/utils'



const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/companies', label: 'Companies', icon: Building2 },
  { to: '/app/stations', label: 'Stations', icon: MapPin },
  { to: '/app/users', label: 'Utilisateurs', icon: Users },
  { to: '/app/permissions', label: 'Permissions', icon: KeyRound },
  { to: '/app/annonces', label: 'Annonces', icon: Megaphone },
];


export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const initUtils = useUtils((s) => s.init)

  useEffect(() => {
    initUtils()
  }, [])
  
  
  function handleLogout() {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="flex h-screen">
    <aside className="flex h-screen w-60 flex-col border-r bg-white shrink-0">
      {/* Logo + badge admin */}
      <div className="flex flex-col gap-1.5 px-6 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
              <ShieldCheck className="h-4 w-4 text-white" /> 
          </div>
          <span className="text-lg font-bold tracking-tight">Tumavu</span>
        </div>
          <span className="ml-10 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-destructive">
            Super Admin
          </span>
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
    <main className="flex-1 overflow-auto">
      <Outlet />
    </main>
    </div>
  )
}
