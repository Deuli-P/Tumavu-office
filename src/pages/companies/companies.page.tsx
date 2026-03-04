import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Briefcase, File } from 'lucide-react'
import type { CompanyListItem } from '@/types/company.types'
import { useUtils } from '@/store/utils.store'
import { MultiSelect } from '@/components/ui/multi-select'

const backendUrl = import.meta.env.VITE_API_BASE_URL

const CompaniesPage = () => {
  const navigate = useNavigate()
  const { countries, stations } = useUtils()

  const [companies, setCompanies] = useState<CompanyListItem[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCountries, setSelectedCountries] = useState<(string | number)[]>([])
  const [selectedStations, setSelectedStations] = useState<(string | number)[]>([])

  useEffect(() => {
    fetch(`${backendUrl}/company/admin`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCompanies(Array.isArray(d) ? d : []))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter((c) => {
    if (selectedCountries.length > 0 && !selectedCountries.includes(c.address.country.id)) return false
    if (selectedStations.length > 0 && !selectedStations.includes(c.station.id)) return false
    return true
  })

  const countryOptions = countries.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` }))
  const stationOptions = stations.map((s) => ({ value: s.id, label: s.name }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? '...' : `${filtered.length} / ${companies.length} companies`}
          </p>
        </div>
        <Link
          to="/app/companies/new"
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle company
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-5">
        <MultiSelect
          options={countryOptions}
          selected={selectedCountries}
          onChange={setSelectedCountries}
          placeholder="Filtrer par pays"
          className="w-64"
        />
        <MultiSelect
          options={stationOptions}
          selected={selectedStations}
          onChange={setSelectedStations}
          placeholder="Filtrer par station"
          className="w-64"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Station</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Propriétaire</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Annonces</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jobs</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ajouté le</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Aucune company trouvée.
                </td>
              </tr>
            )}
            {filtered.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/companies/${company.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-sm font-bold text-destructive shrink-0">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {company.address.locality}, {company.address.country.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{company.station.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {company.owner.firstName.charAt(0)}. {company.owner.lastName}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <File className="h-3.5 w-3.5" />
                    {company._count.announcements}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    {company._count.jobs}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompaniesPage
