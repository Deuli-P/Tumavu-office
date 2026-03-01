import { companies } from '@/data/companies';
import { BlocksIcon, Briefcase, MapPin, Plus, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';


const CompaniePage =() =>{
    const params = useParams();
    const companyId: string = params.id as string;

    const navigate = useNavigate();

    if (!companyId) {
        navigate('/app/companies');
        return null;
    }

    const companieSelected = companies.find(companie => companie.id === companyId);

    if (!companieSelected) {
        navigate('/app/companies');
        return null;
    }

  return (
     <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{companieSelected?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{companieSelected?.employes.length} employés</p>
        </div>
        <Link
          to="/app/companies/new"
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvel emploi
        </Link>
        <Link
          to="/app/companies/new"
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle annonce
        </Link>
        <Link
          to="/app/companies/new"
          className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
        >
          <BlocksIcon className="h-4 w-4" />
          Bloquer l'entreprise
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categorie</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Job</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Candidatures</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Posté le</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {companieSelected.annoucments.map((announce) => {

                const jobTarget = companieSelected.jobs.find(job => job.id === announce.jobId);
                return (
                    <tr key={announce.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-sm font-bold text-destructive shrink-0">
                            {announce.title}
                            </div>
                            <div>
                            <p className="font-medium">{announce.title}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {jobTarget ? jobTarget.location : 'N/A'}
                            </p>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{jobTarget ? jobTarget.type : 'N/A'}</td>
                        <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            {jobTarget ? jobTarget.title : 'N/A'}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {announce.applicationCount}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(announce.postedAt).toLocaleDateString('fr-FR')}
                        </td>
                    </tr>
                )}
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompaniePage;
