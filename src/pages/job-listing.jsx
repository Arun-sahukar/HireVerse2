import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use-fetch";
import { getJobs } from "@/api/apiJobs";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { State } from "country-state-city";
import { Search, X } from "lucide-react";

const JobListing = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [company_id, setCompanyId] = useState("");
    
    const { isLoaded } = useUser();

    const {
        fn: fnJobs,
        data: jobs,
        loading: loadingJobs,
    } = useFetch(getJobs);

    useEffect(() => {
        if (isLoaded) {
            fnJobs({ location, company_id, searchQuery });
        }
    }, [isLoaded, location, company_id]);

    const handleSearch = (e) => {
        e.preventDefault();
        fnJobs({ location, company_id, searchQuery });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setLocation("");
        setCompanyId("");
        fnJobs({});
    };

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#6366f1" />;
    }

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-4">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-center gradient-text">
                    Explore Opportunities
                </h1>
                <p className="text-slate-400 text-center max-w-xl mx-auto">
                    Browse through hundreds of high-quality job listings and find your next growth milestone.
                </p>
            </header>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by Job Title..."
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto px-10 h-13 shadow-lg shadow-primary/10">Search</Button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                 <Select value={location} onValueChange={(val) => setLocation(val)}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Filter by Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {State.getStatesOfCountry("IN").map(({ name }) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                 </Select>

                 <Button 
                    variant="ghost" 
                    className="text-slate-500 hover:text-white gap-2"
                    onClick={clearFilters}
                 >
                    <X className="w-4 h-4" />
                    Clear Filters
                 </Button>
            </div>

            {loadingJobs && (
                <BarLoader width={"100%"} color="#6366f1" />
            )}

            {loadingJobs === false && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {jobs?.length ? (
                        jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                savedInit={job?.saved?.length > 0}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-50">
                             <p className="text-3xl font-bold">No jobs found 👀</p>
                             <p className="text-slate-400">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobListing;
