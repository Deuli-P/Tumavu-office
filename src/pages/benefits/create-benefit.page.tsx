import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { BenefitCategory } from '@/types/benefit.types'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(5, 'Description requise'),
  value: z.string().optional(),
  category: z.enum(['health', 'financial', 'lifestyle', 'education', 'other']),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const categoryOptions: { value: BenefitCategory; label: string; emoji: string }[] = [
  { value: 'health', label: 'Santé', emoji: '🏥' },
  { value: 'financial', label: 'Financier', emoji: '💰' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '✨' },
  { value: 'education', label: 'Formation', emoji: '📚' },
  { value: 'other', label: 'Autre', emoji: '🎁' },
]

export function CreateBenefitPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'other', isActive: true },
  })

  const selectedCategory = watch('category')
  const isActive = watch('isActive')

  function onSubmit(data: FormValues) {
    console.log('Create benefit:', data)
    // TODO: appel API
    navigate('/app/benefits')
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

      <h1 className="text-2xl font-bold">Créer un avantage</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ajoutez un avantage pour attirer les meilleurs candidats.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Catégorie */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Catégorie <span className="text-destructive">*</span></label>
          <div className="grid grid-cols-5 gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setValue('category', cat.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nom de l'avantage <span className="text-destructive">*</span></label>
          <input
            {...register('name')}
            placeholder="ex. Mutuelle santé premium"
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Décrivez cet avantage en détail..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground resize-none"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        {/* Valeur */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Valeur <span className="text-xs text-muted-foreground">(optionnel)</span></label>
          <input
            {...register('value')}
            placeholder="ex. 150 €/mois, 100% remboursé..."
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground"
          />
        </div>

        {/* Statut actif */}
        <div className="flex items-center justify-between rounded-xl border bg-white p-4">
          <div>
            <p className="text-sm font-medium">Avantage actif</p>
            <p className="text-xs text-muted-foreground mt-0.5">Visible par les candidats sur vos annonces</p>
          </div>
          <button
            type="button"
            onClick={() => setValue('isActive', !isActive)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
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
            {isSubmitting ? 'Enregistrement...' : 'Créer l\'avantage'}
          </button>
        </div>
      </form>
    </div>
  )
}
