import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '@/types/auth.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type AuthState = {
  token: string | null
  user: User | null
  isLogged: boolean
  isInitializing: boolean
  setAuth: (payload: { token: string; user: User | null }) => void
  logout: () => void
  signIn: (as: 'ADMIN' | 'MANAGER', email: string, password: string) => Promise<void>
  initSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,
        isLogged: false,
        isInitializing: true,

        // Appelé après login : stocke token + user en mémoire
        // Le cookie HttpOnly est posé automatiquement par le navigateur
        // via le Set-Cookie de la réponse serveur (credentials: 'include' côté page de login)
        setAuth: ({ token, user }) => {
          set({ token, user, isLogged: true })
        },

        logout: async () => {
          try {
            await fetch(`${backendUrl}/auth/logout`, {
              method: 'POST',
              credentials: 'include', // envoie le cookie HttpOnly au serveur
              headers: {
                Authorization: `Bearer ${get().token}`,
              },
            })
          } catch (e) {
            console.log('Logout error:', e)
          } finally {
            set({ isLogged: false, token: null, user: null })
          }
        },

        signIn: async (as: 'ADMIN' | 'MANAGER', email: string, password: string)=> {
            try{
              console.log('start sign in')
              if(email === '' || password === ''){
                  throw new Error('Email et mot de passe sont requis');
              };

            // Regex de mail 
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if(!emailRegex.test(email)){
                  throw new Error('Email invalide');
              };



              console.log('form is valid, sending request', {email, password});
              const response = await fetch(`${backendUrl}/auth/login`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      email: email, 
                      password: password,
                      as: as
                  }),
              });
              if (!response.ok) {
                  throw new Error('Erreur lors de la connexion');
              }
              // On reçoi un cookie httpOnly c'est tout 
          }
          catch(error){
            console.error('Erreur lors de la connexion en tant qu\'admin :', error);
          } 
        },


        initSession: async () => {
          try {
            const response = await fetch(`${backendUrl}/auth/me`, {
              method: 'GET',
              credentials: 'include', // envoie le cookie HttpOnly au serveur
              headers: {
                // token en mémoire si dispo (pas de refresh), sinon le cookie suffit
                'Content-Type': 'application/json',
              },
            })

            if (!response.ok) {
              set({ isLogged: false, token: null, user: null })
              return
            }

            const { userLogged, token } = await response.json()
            set({ isLogged: true, user: userLogged, ...(token ? { token } : {}) })
          } catch (e) {
            console.log('initSession error:', e)
            set({ isLogged: false, token: null, user: null })
          } finally {
            set({ isInitializing: false })
          }
        },
      }),
      {
        name: 'auth-storage',
        // Seul user est persisté en localStorage (pas le token)
        partialize: (state) => ({ user: state.user }),
      },
    ),
    { name: 'AuthStore' },
  ),
)
