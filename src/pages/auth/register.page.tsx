import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function RegisterPage() {
  const setAuth = useAuthStore((state) => state.setAuth)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setAuth({
      token: 'fake-token',
      user: {
        id: '2',
        name: 'New User',
        email: 'new@tumavu.com',
        companyId: 'c1',
        companyName: 'Tumavu',
        role: 'owner',
      },
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Inscription</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cette zone est visible uniquement si tu n&apos;es pas connecté.
      </p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded-md border px-3 py-2"
          type="text"
          placeholder="Nom"
          required
        />
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
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
          type="submit"
        >
          S&apos;inscrire (demo)
        </button>
      </form>

      <p className="mt-4 text-sm">
        Déjà un compte ?{' '}
        <Link className="underline" to="/auth/login/choice">
          Se connecter
        </Link>
      </p>
    </main>
  )
}
