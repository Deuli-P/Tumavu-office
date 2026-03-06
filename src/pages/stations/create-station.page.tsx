import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { CreateStationPayload } from '@/types/station.types'
import { useUtils } from '@/store/utils.store'
import { useTranslation } from 'react-i18next'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  countryId: z.coerce.number().int().positive('Pays requis'),
  officeAddress: z.object({
    street: z.string().min(1, 'Rue requise'),
    zipCode: z.string().optional(),
    locality: z.string().min(1, 'Ville requise'),
  }),
})

type FormValues = z.infer<typeof schema>

export function CreateStationPage() {
  const navigate = useNavigate()
  const { countries } = useUtils()

  const { t } = useTranslation('stations')
  const { t: tc } = useTranslation('common')

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
        zipCode: data.officeAddress.zipCode || undefined,
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
        {tc('actions.back')}
      </button>

      <h1 className="text-2xl font-bold">{t('create.title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('create.subtitle')}
      </p>

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

        {/* Pays */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t('create.field.country')} <span className="text-destructive">*</span>
          </label>
          <select
            {...register('countryId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">{t('create.placeholder.country')}</option>
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
            <h2 className="text-sm font-semibold">{t('create.section.officeAddress')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('create.section.officeAddressDescription')}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">
                {t('create.field.street')} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('officeAddress.street')}
                placeholder={t('create.placeholder.street')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
              {errors.officeAddress?.street && (
                <p className="text-xs text-destructive">{errors.officeAddress.street.message}</p>
              )}
            </div>
            <div className="w-28 space-y-1.5">
              <label className="text-sm font-medium">{t('create.field.zipCode')}</label>
              <input
                {...register('officeAddress.zipCode')}
                placeholder={t('create.placeholder.zipCode')}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {t('create.field.locality')} <span className="text-destructive">*</span>
            </label>
            <input
              {...register('officeAddress.locality')}
              placeholder={t('create.placeholder.locality')}
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
            {tc('actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? t('create.submitting') : t('create.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
