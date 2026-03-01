import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Building2, Briefcase, Users, QrCode, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title)

const stats = [
  { label: 'Companies', value: 34, icon: Building2, color: 'bg-red-50 text-red-600', sub: '+3 ce mois' },
  { label: 'Annonces totales', value: 218, icon: Briefcase, color: 'bg-blue-50 text-blue-600', sub: 'sur toute la plateforme' },
  { label: 'Utilisateurs actifs', value: 512, icon: Users, color: 'bg-purple-50 text-purple-600', sub: 'connectés ce mois' },
  { label: 'Nouveaux inscrits', value: 47, icon: UserPlus, color: 'bg-green-50 text-green-600', sub: 'ce mois-ci' },
]

const scanBarData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [
    {
      label: 'Scans',
      data: [420, 610, 530, 780, 640, 920, 870, 690, 1020, 1150, 1340, 980],
      backgroundColor: 'hsl(0 84.2% 60.2% / 0.80)',
      borderRadius: 6,
    },
  ],
}

const scanBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
  },
}

const rolesDoughnutData = {
  labels: ['Owner', 'Admin entreprise', 'Super Admin'],
  datasets: [
    {
      data: [34, 126, 3],
      backgroundColor: ['hsl(243 75% 59%)', '#6ee7b7', 'hsl(0 84.2% 60.2%)'],
      borderWidth: 0,
    },
  ],
}

const rolesDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 16 } },
  },
}

const recentCompanies = [
  { id: 'c1', name: 'Acme Corp', address: 'Paris, France', jobs: 12, users: 8, createdAt: '2026-02-20' },
  { id: 'c2', name: 'TechFlow SAS', address: 'Lyon, France', jobs: 5, users: 3, createdAt: '2026-02-18' },
  { id: 'c3', name: 'Medilab', address: 'Bordeaux, France', jobs: 9, users: 6, createdAt: '2026-02-15' },
  { id: 'c4', name: 'BuildSmart', address: 'Nantes, France', jobs: 3, users: 2, createdAt: '2026-02-10' },
  { id: 'c5', name: 'DataNest', address: 'Remote', jobs: 7, users: 5, createdAt: '2026-02-05' },
]

export function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vue plateforme</h1>
          <p className="text-sm text-muted-foreground mt-1">Statistiques globales de Tumavu</p>
        </div>
        <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          Super Admin
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Scans bar */}
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <QrCode className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Scans par mois</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Évolution des scans sur la plateforme</p>
          <div className="h-64">
            <Bar data={scanBarData} options={scanBarOptions} />
          </div>
        </div>

        {/* Roles doughnut */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">Répartition des rôles</h2>
          <p className="mb-4 text-xs text-muted-foreground">Tous utilisateurs confondus</p>
          <div className="h-64">
            <Doughnut data={rolesDoughnutData} options={rolesDoughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent companies */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Dernières companies inscrites</h2>
          <Link
            to="/app/companies/new"
            className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:bg-destructive/90 transition-colors"
          >
            + Nouvelle company
          </Link>
        </div>
        <div className="divide-y">
          {recentCompanies.map((company) => (
            <Link
              key={company.id}
              to="/app/companies"
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                  {company.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span>{company.jobs} annonces</span>
                <span>{company.users} utilisateurs</span>
                <span>{new Date(company.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
