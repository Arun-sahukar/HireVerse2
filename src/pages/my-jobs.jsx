import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { getJobs } from "@/api/apiJobs";
import { getApplications } from "@/api/apiApplications";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import ApplicationCard from "@/components/application-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs);

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications);

  useEffect(() => {
    if (isLoaded) {
      if (user?.unsafeMetadata?.role === "recruiter") fnJobs({ recruiter_id: user?.id });
      else fnApplications({ user_id: user?.id });
    }
  }, [isLoaded]);

  if (!isLoaded || loadingJobs || loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#6366f1" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter gradient-text">
          {user?.unsafeMetadata?.role === "recruiter" ? "Recruiter Dashboard" : "My Applications"}
        </h1>
        <p className="text-slate-400">
           {user?.unsafeMetadata?.role === "recruiter" ? "Manage your job listings and review incoming candidates." : "Track the status of your submitted applications."}
        </p>
      </header>

      {user?.unsafeMetadata?.role === "recruiter" ? (
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="jobs" className="flex-1 sm:flex-none">My Listings</TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 sm:flex-none">All Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in mt-6">
              {jobs?.length ? (
                jobs.map((job) => (
                  <JobCard key={job.id} job={job} isMyJob={true} onJobSaved={fnJobs} />
                ))
              ) : (
                <p className="col-span-full text-center py-20 text-slate-500">You haven't posted any jobs yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="applications">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* This would need a broad application fetch if not tied to specific jobs */}
                {/* For now, we assume applications are fetched for all recruiter's jobs */}
                <p className="col-span-full text-center py-20 text-slate-500">Go to Job Details to manage applications for a specific job.</p>
             </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {applications?.length ? (
                applications.map((application) => (
                    <ApplicationCard key={application.id} application={application} isCandidate={true} />
                ))
            ) : (
                <p className="col-span-full text-center py-20 text-slate-500">You haven't applied to any jobs yet.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
