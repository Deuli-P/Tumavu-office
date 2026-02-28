import { Link } from 'react-router-dom'
import { Plus, Check, X } from 'lucide-react'

const mockBenefits = [
  { id: 'b1', name: 'Mutuelle santé premium', description: 'Couverture santé complète prise en charge à 100%', category: 'health', value: '150 €/mois', isActive: true },
  { id: 'b2', name: 'Tickets restaurant', description: 'Tickets restaurant Swile pour tous les employés', category: 'financial', value: '12 €/jour', isActive: true },
  { id: 'b3', name: 'Remote flexible', description: 'Jusqu\'à 3 jours de télétravail par semaine', category: 'lifestyle', value: undefined, isActive: true },
  { id: 'b4', name: 'Budget formation', description: 'Budget annuel pour les formations et conférences', category: 'education', value: '2 000 €/an', isActive: true },
  { id: 'b5', name: 'Sport en entreprise', description: 'Abonnement salle de sport pris en charge', category: 'lifestyle', value: '50 €/mois', isActive: false },
]

const categoryConfig: Record<string, { label: string; emoji: string }> = {
  health: { label: 'Santé', emoji: '🏥' },
  financial: { label: 'Financier', emoji: '💰' },
  lifestyle: { label: 'Lifestyle', emoji: '✨' },
  education: { label: 'Formation', emoji: '📚' },
  other: { label: 'Autre', emoji: '🎁' },
}

export function BenefitsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Avantages</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockBenefits.length} avantage{mockBenefits.length > 1 ? 's' : ''} configurés</p>
        </div>
        <Link
          to="/app/benefits/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvel avantage
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockBenefits.map((benefit) => {
          const cat = categoryConfig[benefit.category] ?? categoryConfig.other
          return (
            <div
              key={benefit.id}
              className={`rounded-xl border bg-white p-5 shadow-sm ${!benefit.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex items-center gap-1.5">
                  {benefit.isActive ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <Check className="h-3 w-3" />
                      Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      <X className="h-3 w-3" />
                      Inactif
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1">{benefit.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{benefit.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">{cat.label}</span>
                {benefit.value && (
                  <span className="text-xs font-semibold text-primary">{benefit.value}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
