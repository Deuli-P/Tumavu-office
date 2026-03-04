import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { CreateStationPayload } from '@/types/station.types'
import { useUtils } from '@/store/utils.store'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  countryId: z.coerce.number().int().positive('Pays requis'),
  officeAddress: z.object({
    street: z.string().min(1, 'Rue requise'),
    number: z.string().optional(),
    locality: z.string().min(1, 'Ville requise'),
  }),
})

type FormValues = z.infer<typeof schema>

export function CreateStationPage() {
  const navigate = useNavigate()
  const { countries } = useUtils()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })


  async function onSubmit(data: FormValues) {
    const payload: CreateStationPayload = {
      name: data.name,
      countryId: data.countryId,
      officeAddress: {
        street: data.officeAddress.street,
        number: data.officeAddress.number || undefined,
        locality: data.officeAddress.locality,
      },
    }

    const response = await fetch(`${backendUrl}/station`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      if (response.status === 409) {
        setError('name', { message: 'Une station avec ce nom existe déjà' })
        return
      }
      setError('root', { message: err.message ?? 'Erreur lors de la création' })
      return
    }

    // Rafraîchit le store pour que la nouvelle station apparaisse partout
    await useUtils.getState().init()
    navigate('/app/stations')
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <h1 className="text-2xl font-bold">Créer une station</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enregistrez une nouvelle station et l'adresse de son office référent.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Nom de la station <span className="text-destructive">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="ex. Les 3 Vallées"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Pays */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Pays <span className="text-destructive">*</span>
          </label>
          <select
            {...register('countryId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">— Sélectionner un pays —</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          {errors.countryId && <p className="text-xs text-destructive">{errors.countryId.message}</p>}
        </div>

        {/* Adresse de l'office */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold">Adresse de l'office référent</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              L'adresse physique du bureau de gestion de cette station.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Rue <span className="text-destructive">*</span>
              </label>
              <input
                {...register('officeAddress.street')}
                placeholder="ex. 12 Rue des Alpes"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.officeAddress?.street && (
                <p className="text-xs text-destructive">{errors.officeAddress.street.message}</p>
              )}
            </div>
            <div className="w-28 space-y-1.5">
              <label className="text-sm font-medium">N°</label>
              <input
                {...register('officeAddress.number')}
                placeholder="12"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Ville <span className="text-destructive">*</span>
            </label>
            <input
              {...register('officeAddress.locality')}
              placeholder="ex. Chambéry"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
            {errors.officeAddress?.locality && (
              <p className="text-xs text-destructive">{errors.officeAddress.locality.message}</p>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Créer la station'}
          </button>
        </div>
      </form>
    </div>
  )
}
