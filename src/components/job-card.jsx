import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, MapPin, Briefcase, Building2, Trash2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { saveJob, deleteJob as apiDeleteJob } from "@/api/apiJobs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const {
    fn: fnSaveJob,
    data: savedData,
    loading: loadingSaveJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSaveJob({ alreadySaved: saved }, {
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };

  const { fn: fnDeleteJob, loading: loadingDeleteJob } = useFetch(apiDeleteJob);

  const handleDeleteJob = async () => {
    await fnDeleteJob({ job_id: job.id });
    onJobSaved();
  };

  useEffect(() => {
    if (savedData !== undefined) setSaved(savedData?.length > 0);
  }, [savedData]);

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col gap-5 hover:shadow-indigo-500/10 hover:shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                 {job.company?.logo_url ? (
                    <img src={job.company.logo_url} className="w-full h-full object-contain" alt={job.company.name} />
                 ) : (
                    <Building2 className="text-slate-500" />
                 )}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <p className="text-slate-400 text-sm">{job.company?.name || "Anonymous Company"}</p>
            </div>
        </div>
        {!isMyJob && (
             <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full", saved ? "text-red-500 bg-red-500/10" : "text-slate-500 hover:text-red-400")}
                onClick={handleSaveJob}
                disabled={loadingSaveJob}
             >
               <Heart className={cn("w-5 h-5", saved && "fill-current")} />
             </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
         <Badge variant="glass" className="gap-1.5 py-1 px-3">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
         </Badge>
         <Badge variant="glass" className="gap-1.5 py-1 px-3">
             <Briefcase className="w-3.5 h-3.5" />
             Full-time
         </Badge>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2">
        {job.description}
      </p>

      <div className="flex gap-4 mt-auto">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold">
            View Details
          </Button>
        </Link>
        {isMyJob && (
           <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-red-500 hover:bg-red-500/10"
            onClick={handleDeleteJob}
            disabled={loadingDeleteJob}
           >
             <Trash2 className="w-5 h-5" />
           </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
