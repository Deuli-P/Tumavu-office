import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { AdminUser } from '@/types/admin.types'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  address: z.string().min(5, 'Adresse complète requise'),
  description: z.string().optional(),
  ownerId: z.string().min(1, 'Veuillez sélectionner un owner'),
})

type FormValues = z.infer<typeof schema>

// Mock : liste des utilisateurs disponibles comme owner
const availableOwners: AdminUser[] = [
  { id: 'u1', name: 'Jean Dupont', email: 'jean.dupont@email.com', role: 'owner', createdAt: '2026-01-01' },
  { id: 'u2', name: 'Claire Martin', email: 'claire.martin@email.com', role: 'owner', createdAt: '2026-01-05' },
  { id: 'u3', name: 'Pierre Bernard', email: 'pierre.bernard@email.com', role: 'admin', createdAt: '2026-01-10' },
  { id: 'u4', name: 'Sophie Leclerc', email: 'sophie.leclerc@email.com', role: 'owner', createdAt: '2026-01-15' },
  { id: 'u5', name: 'Karim Benali', email: 'karim.benali@email.com', role: 'owner', createdAt: '2026-01-20' },
  { id: 'u6', name: 'Amina Diallo', email: 'amina.diallo@email.com', role: 'admin', createdAt: '2026-01-25' },
]

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
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Adresse */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Adresse complète <span className="text-destructive">*</span>
          </label>
          <input
            {...register('address')}
            placeholder="ex. 12 Rue de Rivoli, 75001 Paris, France"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
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
          <label className="text-sm font-medium">
            Owner <span className="text-destructive">*</span>
          </label>
          <select
            {...register('ownerId')}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="">— Sélectionner un utilisateur —</option>
            {availableOwners.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
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
