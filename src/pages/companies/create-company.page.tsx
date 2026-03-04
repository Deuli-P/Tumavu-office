import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { CreateCompanyWithOwnerPayload } from '@/types/company.types'
import { useUtils } from '@/store/utils.store'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  phone: z.string().optional(),
  type: z.string().optional(),
  stationId: z.coerce.number().int().positive('Station requise'),
  address: z.object({
    street: z.string().min(2, 'Rue requise'),
    number: z.string().optional(),
    locality: z.string().min(2, 'Ville requise'),
    countryId: z.coerce.number().int().positive('Pays requis'),
  }),
  owner: z.object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    email: z.string().email('Email invalide'),
  }),
})

type FormValues = z.infer<typeof schema>

export function AdminCreateCompanyPage() {
  const navigate = useNavigate()
  const { stations, countries } = useUtils()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      stationId: undefined,
      address: { countryId: undefined },
    },
  })

  // Auto-fill le pays de l'adresse quand une station est sélectionnée
  const selectedStationId = watch('stationId')
  useEffect(() => {
    if (!selectedStationId) return
    const station = stations.find((s) => s.id === Number(selectedStationId))
    if (station) {
      setValue('address.countryId', station.country.id, { shouldValidate: true })
    }
  }, [selectedStationId, stations, setValue])

  async function onSubmit(data: FormValues) {
    const payload: CreateCompanyWithOwnerPayload = {
      name: data.name,
      description: data.description,
      phone: data.phone,
      type: data.type,
      stationId: data.stationId,
      address: {
        street: data.address.street,
        number: data.address.number || undefined,
        locality: data.address.locality,
        countryId: data.address.countryId,
      },
      owner: {
        firstName: data.owner.firstName,
        lastName: data.owner.lastName,
        email: data.owner.email,
      },
    }

    const response = await fetch(`${backendUrl}/company/admin`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      if (response.status === 409) {
        setError('owner.email', { message: 'Un compte avec cet email existe déjà' })
        return
      }
      setError('root', { message: err.message ?? 'Erreur lors de la création' })
      return
    }

    navigate('/app/companies')
  }

  const selectedCountryId = watch('address.countryId')

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <h1 className="text-2xl font-bold">Créer une company</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enregistrez une nouvelle entreprise sur la plateforme.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Nom de la company <span className="text-destructive">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="ex. Acme Corp"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Station */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Station <span className="text-destructive">*</span>
          </label>
          <select
            {...register('stationId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">— Sélectionner une station —</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.country.name})
              </option>
            ))}
          </select>
          {errors.stationId && <p className="text-xs text-destructive">{errors.stationId.message}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <input
              {...register('type')}
              placeholder="ex. Agriculture"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Téléphone</label>
            <input
              {...register('phone')}
              placeholder="ex. +33 6 00 00 00 00"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Description <span className="text-xs text-muted-foreground">(optionnel)</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Décrivez brièvement l'activité de cette company..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Adresse */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Adresse</h2>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Rue <span className="text-destructive">*</span>
              </label>
              <input
                {...register('address.street')}
                placeholder="ex. 12 Rue de Rivoli"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.address?.street && <p className="text-xs text-destructive">{errors.address.street.message}</p>}
            </div>
            <div className="w-24 space-y-1.5">
              <label className="text-sm font-medium">N°</label>
              <input
                {...register('address.number')}
                placeholder="12"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Ville <span className="text-destructive">*</span>
              </label>
              <input
                {...register('address.locality')}
                placeholder="ex. Paris"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.address?.locality && <p className="text-xs text-destructive">{errors.address.locality.message}</p>}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Pays <span className="text-destructive">*</span>
              </label>
              <select
                {...register('address.countryId')}
                value={selectedCountryId ?? ''}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              >
                <option value="">— Sélectionner un pays —</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.address?.countryId && <p className="text-xs text-destructive">{errors.address.countryId.message}</p>}
            </div>
          </div>
        </div>

        {/* Propriétaire */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Propriétaire</h2>
          <p className="text-xs text-muted-foreground">
            Un compte sera créé avec le mot de passe par défaut <code className="font-mono">azertyuiop</code>.
          </p>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Prénom <span className="text-destructive">*</span>
              </label>
              <input
                {...register('owner.firstName')}
                placeholder="ex. Jean"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.owner?.firstName && <p className="text-xs text-destructive">{errors.owner.firstName.message}</p>}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                Nom <span className="text-destructive">*</span>
              </label>
              <input
                {...register('owner.lastName')}
                placeholder="ex. Dupont"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.owner?.lastName && <p className="text-xs text-destructive">{errors.owner.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              {...register('owner.email')}
              type="email"
              placeholder="ex. jean.dupont@entreprise.fr"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
            {errors.owner?.email && <p className="text-xs text-destructive">{errors.owner.email.message}</p>}
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
            {isSubmitting ? 'Création...' : 'Créer la company'}
          </button>
        </div>
      </form>
    </div>
  )
}
