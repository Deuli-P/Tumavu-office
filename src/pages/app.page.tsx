import { useAuthStore } from '@/store/auth.store'

export function AppPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Espace connecté</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cette zone est visible uniquement avec un token.
      </p>
      <p className="mt-4 text-sm">
        Utilisateur: <strong>{user?.name ?? 'Inconnu'}</strong>
      </p>
      <button
        className="mt-6 w-fit rounded-md border px-4 py-2"
        onClick={logout}
        type="button"
      >
        Se déconnecter
      </button>
    </main>
  )
}
