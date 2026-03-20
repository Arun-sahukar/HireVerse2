import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { getSavedJobs } from "@/api/apiJobs";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#6366f1" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter gradient-text">
          Saved Jobs
        </h1>
        <p className="text-slate-400">
           Review and manage the opportunities you've shortlisted.
        </p>
      </header>

      {loadingSavedJobs === false && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved?.job}
                onJobSaved={fnSavedJobs}
                savedInit={true}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-50">
                <p className="text-3xl font-bold">No Saved Jobs 👀</p>
                <p className="text-slate-400">Go find some amazing opportunities and save them here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
