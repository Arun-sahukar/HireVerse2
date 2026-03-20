import { useUser } from "@clerk/clerk-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a company" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
       location: "",
       company_id: "",
       description: ""
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  console.log("Companies Data:", companies);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    const jobData = {
      ...data,
      company_id: Number(data.company_id),
      recruiter_id: user.id,
      is_open: true,
    };
    console.log("Submitting Job Data:", jobData);
    fnCreateJob(jobData);
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#6366f1" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-4 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter gradient-text">
          Post a Job
        </h1>
        <p className="text-slate-400">
           Fill the information carefully to attract the best talent.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card p-10 rounded-3xl flex flex-col gap-8 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <Label className="text-slate-300">Job Title</Label>
             <Input placeholder="E.g. Senior Product Designer" {...register("title")} />
             {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
           </div>

           <div className="space-y-2">
             <Label className="text-slate-300">Location</Label>
             <Controller
                name="location"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                            <SelectGroup>
                                {State.getStatesOfCountry("IN").map(({ name }) => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
             />
             {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
           </div>
        </div>

        <div className="space-y-2">
           <Label className="text-slate-300">Select Company</Label>
           <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Company">
                                {(field.value && companies?.length > 0) ? companies?.find(c => String(c.id) === field.value)?.name : "Select Company"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                            <SelectGroup>
                                {companies?.map(({ name, id }) => (
                                    <SelectItem key={name} value={String(id)}>{name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
           />
           {errors.company_id && <p className="text-red-500 text-xs">{errors.company_id.message}</p>}
        </div>

        <div className="space-y-2">
           <Label className="text-slate-300">Job Description (Markdown)</Label>
           <Controller
             name="description"
             control={control}
             render={({ field }) => (
               <div data-color-mode="dark">
                  <MDEditor value={field.value} onChange={field.onChange} />
               </div>
             )}
           />
           {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        {errorCreateJob?.message && <p className="text-red-500 text-sm">{errorCreateJob?.message}</p>}
        {loadingCreateJob && <BarLoader width={"100%"} color="#6366f1" />}

        <Button type="submit" size="lg" className="shadow-lg shadow-indigo-500/20 py-8 text-xl font-bold">
            Publish Job Listing
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
