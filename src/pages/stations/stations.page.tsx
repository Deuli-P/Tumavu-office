import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, MapPin, Globe } from 'lucide-react'
import { useUtils } from '@/store/utils.store'

export function StationsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('stations')
  const { stations } = useUtils()

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => navigate('/app/stations/new')}
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('new')}
        </button>
      </div>

      <div className="mt-8">
        {stations.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">{t('noStations')}</p>
            <button
              onClick={() => navigate('/app/stations/new')}
              className="mt-4 text-sm font-medium text-destructive hover:underline"
            >
              {t('createFirst')}
            </button>
          </div>
        )}
        {stations.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <div
                key={station.id}
                onClick={() => navigate(`/app/stations/${station.id}`)}
                className="rounded-xl border bg-white p-5 shadow-sm space-y-3 cursor-pointer hover:border-destructive/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h2 className="font-semibold">{station.name}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    #{station.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span>{station.country.name} ({station.country.code})</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    {station.officeAddress.street}
                    {station.officeAddress.number ? ` ${station.officeAddress.number}` : ''},&nbsp;
                    {station.officeAddress.locality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
