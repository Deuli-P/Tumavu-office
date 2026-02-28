import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ContractType, JobStatus } from '@/types/job.types'

const schema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().min(10, 'Description trop courte'),
  location: z.string().min(2, 'Localisation requise'),
  contractType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  salary: z.string().optional(),
  status: z.enum(['active', 'draft', 'closed']),
})

type FormValues = z.infer<typeof schema>

const contractOptions: { value: ContractType; label: string }[] = [
  { value: 'full-time', label: 'CDI' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'contract', label: 'CDD' },
  { value: 'internship', label: 'Stage / Alternance' },
  { value: 'freelance', label: 'Freelance' },
]

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'active', label: 'Publier maintenant' },
  { value: 'draft', label: 'Enregistrer en brouillon' },
]

export function CreateJobPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', contractType: 'full-time' },
  })

  function onSubmit(data: FormValues) {
    console.log('Create job:', data)
    // TODO: appel API
    navigate('/app/jobs')
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <h1 className="text-2xl font-bold">Créer une annonce</h1>
      <p className="mt-1 text-sm text-muted-foreground">Remplissez les informations pour publier votre offre d'emploi.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Titre */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Titre du poste <span className="text-destructive">*</span></label>
          <input
            {...register('title')}
            placeholder="ex. Développeur React Senior"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
          <textarea
            {...register('description')}
            rows={6}
            placeholder="Décrivez le poste, les missions, le profil recherché..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground resize-none"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        {/* Localisation + Type contrat */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Localisation <span className="text-destructive">*</span></label>
            <input
              {...register('location')}
              placeholder="ex. Paris, Remote..."
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type de contrat <span className="text-destructive">*</span></label>
            <select
              {...register('contractType')}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            >
              {contractOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Salaire */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Salaire <span className="text-xs text-muted-foreground">(optionnel)</span></label>
          <input
            {...register('salary')}
            placeholder="ex. 45 000 € – 55 000 € / an"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
        </div>

        {/* Divider */}
        <div className="border-t pt-6">
          <p className="mb-4 text-sm font-medium">Publication</p>
          <div className="flex gap-3">
            {statusOptions.map((o) => (
              <label key={o.value} className="flex-1">
                <input {...register('status')} type="radio" value={o.value} className="sr-only peer" />
                <div className="cursor-pointer rounded-lg border-2 border-transparent bg-muted px-4 py-3 text-sm text-center font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary">
                  {o.label}
                </div>
              </label>
            ))}
          </div>
        </div>

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
            className="flex-1 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : 'Créer l\'annonce'}
          </button>
        </div>
      </form>
    </div>
  )
}
