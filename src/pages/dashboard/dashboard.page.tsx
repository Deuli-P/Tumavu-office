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
import { Briefcase, Users, Clock, TrendingUp, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title)

const stats = [
  { label: 'Passages ce mois-ci', value: 12, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
  { label: 'Annonces actives', value: 8, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  { label: 'Candidatures actives', value: 16, icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'Avantages actifs', value: 4, icon: Ticket, color: 'bg-orange-50 text-orange-600' },
]

const barData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [
    {
      label: 'Passages',
      data: [8, 15, 12, 22, 18, 30, 25, 19, 28, 35, 40, 27],
      backgroundColor: 'hsl(243 75% 59% / 0.85)',
      borderRadius: 6,
    },
  ],
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
  },
}

const doughnutData = {
  labels: ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'],
  datasets: [
    {
      data: [40, 25, 15, 12, 8],
      backgroundColor: [
        'hsl(243 75% 59%)',
        '#6ee7b7',
        '#fbbf24',
        '#f87171',
        '#60a5fa',
      ],
      borderWidth: 0,
    },
  ],
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 16 } },
  },
}

const recentJobs = [
  { id: '1', title: 'Développeur React Senior', location: 'Paris', applications: 24, status: 'active' },
  { id: '2', title: 'Designer UX/UI', location: 'Lyon', applications: 18, status: 'active' },
  { id: '3', title: 'Chef de projet digital', location: 'Remote', applications: 11, status: 'active' },
  { id: '4', title: 'Data Analyst', location: 'Bordeaux', applications: 7, status: 'draft' },
]

const statusLabel: Record<string, string> = {
  active: 'Actif',
  draft: 'Brouillon',
  closed: 'Fermé',
}
const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  closed: 'bg-red-100 text-red-700',
}

export function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de votre activité de recrutement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar chart */}
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">Travailleurs scannés par mois</h2>
          <p className="mb-4 text-xs text-muted-foreground">Évolution sur l'année en cours</p>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">Types de contrats</h2>
          <p className="mb-4 text-xs text-muted-foreground">Répartition des annonces actives</p>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Annonces récentes</h2>
          <Link
            to="/app/jobs/new"
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
          >
            + Nouvelle annonce
          </Link>
        </div>
        <div className="divide-y">
          {recentJobs.map((job) => (
            <Link
              key={job.id}
              to={`/app/jobs/${job.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{job.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{job.applications} candidatures</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[job.status]}`}>
                  {statusLabel[job.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
