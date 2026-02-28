import { Building2, ShieldUser } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ChoiceLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Connexion</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Se connecter à la plateforme en tant que :
            </p>
        </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link
          to="/auth/login/company"
          className="flex h-100 rounded-xl border-2 border-primary/30 bg-primary text-primary-foreground transition-colors hover:bg-primary/70 justify-center items-center flex-col gap-4 p-4"
        >
          <Building2 className="  size-10 " />
          <span className="inset-x-3 bottom-4 text-center text-sm font-medium leading-tight">
            Gestionnaire d&apos;une entreprise
          </span>
        </Link>

        <Link
          to="/auth/login/admin"
          className="flex h-100 rounded-xl border-2 border-primary/30 bg-primary text-primary-foreground transition-colors hover:bg-primary/70 justify-center items-center flex-col gap-4 p-4"
        >
          <ShieldUser className="  size-10 " />
          <span className="inset-x-3 bottom-4 text-center text-sm font-medium leading-tight">
            Super Admin
          </span>
        </Link>
      </div>

    </main>
  )
}
