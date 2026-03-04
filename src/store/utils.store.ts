import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { CountryOption, StationData } from '@/types/station.types'

const backendUrl = import.meta.env.VITE_API_BASE_URL

type UtilsState = {
  countries: CountryOption[]
  stations: StationData[]
  // Appeler au montage du layout authentifié pour rafraîchir les données
  init: () => Promise<void>
}

const fetchArray = (url: string): Promise<never[]> =>
  fetch(url, { credentials: 'include' })
    .then((r) => (r.ok ? r.json().then((d) => (Array.isArray(d) ? d : [])) : []))
    .catch(() => [])

export const useUtils = create<UtilsState>()(
  devtools(
    persist(
      (set) => ({
        countries: [],
        stations: [],

        init: async () => {
          const [countries, stations] = await Promise.all([
            fetchArray(`${backendUrl}/settings/countries`),
            fetchArray(`${backendUrl}/station`),
          ])
          set({ countries, stations })
        },
      }),
      {
        name: 'utils-storage',
        // Persiste les données pour un affichage immédiat au rechargement,
        // mais init() rafraîchit toujours depuis l'API.
        partialize: (state) => ({ countries: state.countries, stations: state.stations }),
      },
    ),
    { name: 'UtilsStore' },
  ),
)
