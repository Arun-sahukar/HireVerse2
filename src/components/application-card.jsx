import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, School, Briefcase, Star, CheckCircle2, XCircle } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus
  );

  const handleStatusChange = (status) => {
    fnHiringStatus({ job_id: application.job_id }, status);
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application?.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <School className="w-3.5 h-3.5" />
             {application?.education}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-800 bg-white/5 hover:bg-white/10 gap-2"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Resume
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
         <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            {application?.experience} Years Exp.
         </div>
         <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-400" />
            {application?.skills}
         </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
         <div className="text-xs text-slate-500">
            Applied {new Date(application.created_at).toLocaleDateString()}
         </div>
         {isCandidate ? (
             <Badge variant={application.status === 'applied' ? 'secondary' : (application.status === 'hired' ? 'default' : 'destructive')} className="capitalize">
                {application.status}
             </Badge>
         ) : (
             <div className="flex gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-emerald-500 hover:bg-emerald-500/10 gap-1.5"
                    onClick={() => handleStatusChange("hired")}
                    disabled={loadingHiringStatus}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Hire
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-500/10 gap-1.5"
                    onClick={() => handleStatusChange("rejected")}
                    disabled={loadingHiringStatus}
                >
                    <XCircle className="w-4 h-4" />
                    Reject
                </Button>
             </div>
         )}
      </div>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#6366f1" />}
    </div>
  );
};

export default ApplicationCard;
