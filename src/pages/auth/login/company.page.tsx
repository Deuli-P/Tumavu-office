import { useState, type SubmitEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function LoginCompanyPage() {
  const setAuth = useAuthStore((state) => state.setAuth)
    const [ loading, setLoading ] = useState<boolean>(false);
  
    const [ form , setForm ]= useState<{email: string, password: string}>({
      email: '',
      password: '',
    })
  

  
  const handleSignIn = async ()=> {
    try{
        setLoading(true);
        console.log('start sign in')
        if(form.email === '' || form.password === ''){
            throw new Error('Email et mot de passe sont requis');
        };

       // Regex de mail 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(form.email)){
            throw new Error('Email invalide');
        };



        console.log('form is valid, sending request', form);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: form.email, 
                password: form.password,
                as: 'COMPANY'
            }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
        }
        const data = await response.json();
        setAuth({
            token: data.token,
            user: data.user,
        });
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
