import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Building2, Briefcase, Users, QrCode, UserPlus, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const backendUrl = import.meta.env.VITE_API_BASE_URL

// ── Types ──────────────────────────────────────────────────────────────────

interface DashboardData {
  stats: {
    companiesTotal: number
    companiesThisMonth: number
    jobOffersTotal: number
    activeUsersThisMonth: number
    newUsersThisMonth: number
  }
  passagesByMonth: { month: string; count: number }[]
  roleDistribution: { label: string; count: number }[]
  recentCompanies: {
    id: string
    name: string
    createdAt: string
    address: { locality: string; country: { name: string } }
    _count: { jobOffers: number; passages: number }
  }[]
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
  '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
}

function monthLabel(yyyymm: string) {
  const [, m] = yyyymm.split('-')
  return MONTH_LABELS[m] ?? yyyymm
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const { t } = useTranslation('dashboard')
  const { t: tc } = useTranslation('common')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${backendUrl}/dashboard/admin`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const barData = {
    labels: (data?.passagesByMonth ?? []).map((p) => monthLabel(p.month)),
    datasets: [
      {
        label: 'Passages',
        data: (data?.passagesByMonth ?? []).map((p) => p.count),
        backgroundColor: 'hsl(0 84.2% 60.2% / 0.80)',
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
    labels: (data?.roleDistribution ?? []).map((r) => r.label),
    datasets: [
      {
        data: (data?.roleDistribution ?? []).map((r) => r.count),
        backgroundColor: ['hsl(243 75% 59%)', 'hsl(0 84.2% 60.2%)'],
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

  const statsConfig = data
    ? [
        {
          label: t('stats.companies'),
          value: data.stats.companiesTotal,
          icon: Building2,
          color: 'bg-red-50 text-red-600',
          sub: t('stats.companiesThisMonth', { count: data.stats.companiesThisMonth }),
        },
        {
          label: t('stats.jobOffers'),
          value: data.stats.jobOffersTotal,
          icon: Briefcase,
          color: 'bg-blue-50 text-blue-600',
          sub: t('stats.jobOffersSub'),
        },
        {
          label: t('stats.activeUsers'),
          value: data.stats.activeUsersThisMonth,
          icon: Users,
          color: 'bg-purple-50 text-purple-600',
          sub: t('stats.activeUsersSub'),
        },
        {
          label: t('stats.newUsers'),
          value: data.stats.newUsersThisMonth,
          icon: UserPlus,
          color: 'bg-green-50 text-green-600',
          sub: t('stats.newUsersSub'),
        },
      ]
    : []

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          {tc('superAdmin')}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))
          : statsConfig.map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold">{value ? value.toLocaleString('fr-FR') : 0}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{sub}</p>
              </div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <QrCode className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">{t('charts.passages')}</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">{t('charts.passagesSub')}</p>
          <div className="h-64">
            {loading
              ? <Skeleton className="h-full w-full" />
              : <Bar data={barData} options={barOptions} />
            }
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">{t('charts.roles')}</h2>
          <p className="mb-4 text-xs text-muted-foreground">{t('charts.rolesSub')}</p>
          <div className="h-64">
            {loading
              ? <Skeleton className="h-full w-full rounded-full" />
              : <Doughnut data={doughnutData} options={doughnutOptions} />
            }
          </div>
        </div>
      </div>

      {/* Recent companies */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">{t('recentCompanies.title')}</h2>
          <Link
            to="/app/companies/new"
            className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:bg-destructive/90 transition-colors"
          >
            {t('recentCompanies.new')}
          </Link>
        </div>
        <div className="divide-y">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-40" />
                </div>
              ))
            : (data?.recentCompanies ?? []).map((company) => (
                <Link
                  key={company.id}
                  to={`/app/companies/${company.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                      {company.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {company.address.locality}, {company.address.country.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {t('recentCompanies.jobOffers', { count: company._count.jobOffers })}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {t('recentCompanies.passages', { count: company._count.passages })}
                    </span>
                    <span>{new Date(company.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  )
}
