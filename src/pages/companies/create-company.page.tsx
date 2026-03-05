import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { CreateCompanyWithOwnerPayload } from '@/types/company.types'
import { useUtils } from '@/store/utils.store'
import { useTranslation } from 'react-i18next'

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
  const { stations, countries } = useUtils();

  const { t } = useTranslation('companies')
  const { t: tc } = useTranslation('common')
  const { i18n } = useTranslation()

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
        {tc('actions.back')}
      </button>

      <h1 className="text-2xl font-bold">{t('create.title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('create.subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.field.name')} <span className="text-destructive">*</span>
          </label>
          <input
            {...register('name')}
            placeholder={t('create.placeholder.name')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Station */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.field.station')} <span className="text-destructive">*</span>
          </label>
          <select
            {...register('stationId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">— {t('create.placeholder.station')} —</option>
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
            <label className="text-sm font-medium">{t('create.field.type')}</label>
            <input
              {...register('type')}
              placeholder={t('create.placeholder.type')}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">{t('create.field.phone')}</label>
            <input
              {...register('phone')}
              placeholder={t('create.placeholder.phone')}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.field.description')} <span className="text-xs text-muted-foreground">({tc('actions.optionnal')})</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder={t('create.placeholder.description')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Adresse */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t('create.section.address')}</h2>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.street')} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('address.street')}
                placeholder={t('create.placeholder.street')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.address?.street && <p className="text-xs text-destructive">{errors.address.street.message}</p>}
            </div>
            <div className="w-24 space-y-1.5">
              <label className="text-sm font-medium">{t('create.field.number')}</label>
              <input
                {...register('address.number')}
                placeholder={t('create.placeholder.number')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.locality')} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('address.locality')}
                placeholder={t('create.placeholder.locality')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.address?.locality && <p className="text-xs text-destructive">{errors.address.locality.message}</p>}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.country')} <span className="text-destructive">*</span>
              </label>
              <select
                {...register('address.countryId')}
                value={selectedCountryId ?? ''}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              >
                <option value="">{t('create.placeholder.country')}</option>
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
          <h2 className="text-sm font-semibold">{t('create.section.owner.title')}</h2>
          <p className="text-xs text-muted-foreground">
            {t('create.section.owner.description', { defaultPassword: 'azertyuiop' })}
          </p>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.firstName')} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('owner.firstName')}
                placeholder={t('create.placeholder.firstName')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.owner?.firstName && <p className="text-xs text-destructive">{errors.owner.firstName.message}</p>}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.lastName')} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('owner.lastName')}
                placeholder={t('create.placeholder.lastName')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.owner?.lastName && <p className="text-xs text-destructive">{errors.owner.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {t('create.field.email')} <span className="text-destructive">*</span>
            </label>
            <input
              {...register('owner.email')}
              type="email"
              placeholder={t('create.placeholder.email')}
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
            {tc('actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? tc('state.loading') : tc('actions.create')}
          </button>
        </div>
      </form>
    </div>
  )
}
