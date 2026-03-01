import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { stations } from '@/data/stations'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  address: z.object({
    street: z.string().min(5, 'Adresse complète requise'),
    city: z.string().min(2, 'Ville requise'),
    zipCode: z.string().min(2, 'Code postal requis'),
  }),
  description: z.string().optional(),
  ownerId: z.string().min(1, 'Veuillez sélectionner un owner'),
})

type FormValues = z.infer<typeof schema>

// Mock : liste des utilisateurs disponibles comme owner

export function AdminCreateCompanyPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ownerId: '' },
  })

  function onSubmit(data: FormValues) {
    console.log('Create company:', data)
    // TODO: appel API
    navigate('/app/companies')
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
          <label className="text-sm font-medium">
            Station <span className="text-destructive">*</span>
          </label>
          <select
            {...register('ownerId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">— Sélectionner un utilisateur —</option>
            {stations.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.country.name})
              </option>
            ))}
          </select>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Adresse */}
        <div className="space-y-1.5">
          <h2 className='text-m font-medium'>Adresse</h2>
          <div className="flex flex-col w-full">
            <label className="text-sm font-medium">
              Rue <span className="text-destructive">*</span>
            </label>
            <input
              {...register('address.street')}
              placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
           </div>
        <div className='flex flex-row gap-4'>
           <div className="flex flex-col">
          <label className="text-sm font-medium">
            Code postal <span className="text-destructive">*</span>
          </label>
          <input
            {...register('address.zipCode')}
            placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
            className="w-30 rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium">
           Ville <span className="text-destructive">*</span>
          </label>
          <input
            {...register('address.city')}
            placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
            />
          </div>
            </div>
        
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Description <span className="text-xs text-muted-foreground">(optionnel)</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Décrivez brièvement l'activité de cette company..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Owner */}
        <div className="space-y-1.5">
          <h2 className='text-m font-medium'>Proprietaire</h2>
          <div className="flex flex-row gap-4 w-full">

          <div className="flex flex-col w-full">
            <label className="text-sm font-medium">
              Prénom <span className="text-destructive">*</span>
            </label>
            <input
              {...register('address.street')}
              placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
           </div>
           <div className="flex flex-col w-full">
            <label className="text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </label>
            
            <input
              {...register('address.street')}
              placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
           </div>
            </div>
           <div className="flex flex-col w-full">
            <label className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              {...register('address.street')}
              placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
              />
           </div>
          {errors.ownerId && <p className="text-xs text-destructive">{errors.ownerId.message}</p>}
          <p className="text-xs text-muted-foreground">
            L'owner aura un accès complet à l'espace de cette company.
          </p>
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
            className="flex-1 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Créer la company'}
          </button>
        </div>
      </form>
    </div>
  )
}
