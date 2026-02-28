import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth)

  const onSubmitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuth({
      token: 'fake-token-user',
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@tumavu.com',
        companyId: 'c1',
        companyName: 'Tumavu Demo',
        role: 'owner',
      },
    })
  }

  function loginAsAdmin() {
    setAuth({
      token: 'fake-token-admin',
      user: {
        id: 'admin-1',
        name: 'Admin Système',
        email: 'admin@tumavu.com',
        companyId: '',
        companyName: '',
        role: 'ADMIN',
      },
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Connexion</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cette zone est visible uniquement si tu n&apos;es pas connecté.
      </p>

      <form className="mt-6 space-y-3" onSubmit={onSubmitUser}>
        <input
          className="w-full rounded-md border px-3 py-2"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded-md border px-3 py-2"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <button
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
          type="submit"
        >
          Se connecter (demo entreprise)
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={loginAsAdmin}
        className="w-full rounded-md border-2 border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        Se connecter en tant que Super Admin
      </button>

      <p className="mt-6 text-sm">
        Pas de compte ?{' '}
        <Link className="underline" to="/auth/register">
          Créer un compte
        </Link>
      </p>
    </main>
  )
}
