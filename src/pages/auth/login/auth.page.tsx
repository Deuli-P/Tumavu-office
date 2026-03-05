import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth.store'
import { Building2 } from 'lucide-react'

export function LoginPage() {
  const { signIn } = useAuthStore()
  const { t } = useTranslation('auth')
  const [loading, setLoading] = useState<boolean>(false)

  const [ form , setForm ]= useState<{email: string, password: string}>({
    email: 'admin@tumavu.eu',
    password: 'azertyuiop',
  })


  const handleSignIn = async ()=> {
    try{
        setLoading(true);
        await signIn('ADMIN', form.email, form.password);
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
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>

      <div className="mt-6 space-y-3">
        <input
            className="w-full rounded-md border px-3 py-2"
            type="email"
            placeholder={t('email')}
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({...prev, email: e.target.value}))}
        />
        <input
            className="w-full rounded-md border px-3 py-2"
            type="password"
            placeholder={t('password')}
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
          {loading ? t('submitting') : t('submit')}
        </button>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">{t('or')}</span>
        </div>
      </div>
      <Link
        to="/auth/login/company"
        className="w-full rounded-md border-2 border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/70 transition-colors gap-4 flex justify-center items-center"
      >
        <Building2 className="  size-10 " />
        <p className="text-center">
        {t('companyLogin')}
        </p>
      </Link>

    </main>
  )
}
