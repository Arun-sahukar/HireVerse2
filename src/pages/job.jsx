import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { BarLoader } from "react-spinners";
import { MapPin, Briefcase, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ApplyJob from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";

const JobPage = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus
  );

  const handleStatusChange = (value) => {
    const is_open = value === "open";
    fnHiringStatus({ job_id: id }, is_open).then(() => fnJob({ job_id: id }));
  };

  useEffect(() => {
    if (isLoaded) fnJob({ job_id: id });
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#6366f1" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-6">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
               <Briefcase className="w-6 h-6" />
             </div>
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter gradient-text">
               {job?.title}
             </h1>
           </div>
           
           <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4" />
                <span className="font-semibold text-slate-200">{job?.company?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Posted {new Date(job?.created_at).toLocaleDateString()}</span>
              </div>
           </div>

           <div className="flex gap-2">
             <Badge variant={job?.is_open ? "secondary" : "destructive"} className="px-3 py-1">
                {job?.is_open ? "Hiring Open" : "Closed"}
             </Badge>
           </div>
        </div>

        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
           {job?.company?.logo_url ? (
             <img src={job.company.logo_url} className="w-full h-full object-contain" alt={job.company.name} />
           ) : (
             <Building2 className="w-12 h-12 text-slate-700" />
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
           <div className="glass-card p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Job Description
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300">
                 <MDEditor.Markdown source={job?.description} style={{ background: 'transparent', color: 'inherit' }} />
              </div>
           </div>

           {/* Hiring Status Control (for Recruiters) */}
           {job?.recruiter_id === user?.id && (
             <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border-indigo-500/20">
               <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="font-bold">Hiring Status</h3>
                    <p className="text-sm text-slate-400">Update the job visibility</p>
                  </div>
               </div>
               <Select onValueChange={handleStatusChange}>
                 <SelectTrigger className={cn("w-[200px]", job?.is_open ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                    <SelectValue placeholder={job?.is_open ? "Open" : "Closed"} />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           )}
        </div>

        <div className="flex flex-col gap-6">
           <div className="glass-card p-8 rounded-3xl flex flex-col gap-6 items-center text-center">
              <h3 className="text-xl font-bold">Apply for this role</h3>
              <p className="text-slate-400 text-sm">Join the team at {job?.company?.name} and grow your career.</p>
              {job?.recruiter_id !== user?.id && (
                <ApplyJob
                  job={job}
                  user={user}
                  fetchJob={fnJob}
                  applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
                />
              )}
           </div>
        </div>
      </div>

      {/* Applications list (for recruiters) */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold">Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;
