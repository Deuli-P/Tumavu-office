import { useState} from 'react'
import { useAuthStore } from '@/store/auth.store'

export function LoginCompanyPage() {
  const {signIn } = useAuthStore()
    const [ loading, setLoading ] = useState<boolean>(false);
  
    const [ form , setForm ]= useState<{email: string, password: string}>({
      email: '',
      password: '',
    })
  

  
   const handleSignIn = async ()=> {
    try{
        setLoading(true);
        await signIn('MANAGER', form.email, form.password);
    }
    catch(error){
      console.error('Erreur lors de la connexion en tant qu\'admin :', error);
    } 
    finally {
        setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Connexion</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Authentification pour les entreprises.
      </p>
      <div className="mt-6 space-y-3">
        <input
            className="w-full rounded-md border px-3 py-2"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({...prev, email: e.target.value}))}
        />
        <input
            className="w-full rounded-md border px-3 py-2"
            type="password"
            placeholder="Mot de passe"
            required
            value={form.password}
            onChange={(e) => setForm((prev) => ({...prev, password: e.target.value}))}
        />
        <button
          className="w-full rounded-md bg-yellow-500 px-4 py-2 text-primary-foreground text-sm font-medium"
          type="button"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Connexion en cours' : 'Se connecter'}
        </button>
      </div>


    </main>
  )
}
