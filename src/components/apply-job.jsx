import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" }),
  education: z.string().min(1, { message: "Education is required" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  resume: z
    .any()
    .refine(
      (file) =>
        file?.[0] &&
        (file?.[0].type === "application/pdf" ||
          file?.[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

const ApplyJob = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={applied ? "outline" : "default"}
          disabled={applied}
          className="w-full sm:w-auto px-10 h-14 font-bold shadow-lg"
        >
          {applied ? "Applied" : "Apply for this Job"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-white/10">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            Apply for <span className="text-indigo-400">{job?.title}</span>
          </DrawerTitle>
          <DrawerDescription className="text-slate-400">
            Please fill in the form below to submit your application.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-slate-300">Years of Experience</Label>
                <Input
                    id="experience"
                    type="number"
                    placeholder="E.g. 5"
                    className="bg-white/5 border-white/5"
                    {...register("experience", { valueAsNumber: true })}
                />
                {errors.experience && (
                    <p className="text-red-500 text-xs">{errors.experience.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="education" className="text-slate-300">Highest Education</Label>
                <Input
                    id="education"
                    placeholder="E.g. B.Tech Computer Science"
                    className="bg-white/5 border-white/5"
                    {...register("education")}
                />
                {errors.education && (
                    <p className="text-red-500 text-xs">{errors.education.message}</p>
                )}
              </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-slate-300">Skills (Comma separated)</Label>
            <Input
                id="skills"
                placeholder="E.g. React, Node.js, Next.js"
                className="bg-white/5 border-white/5"
                {...register("skills")}
            />
            {errors.skills && (
                <p className="text-red-500 text-xs">{errors.skills.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-slate-300">Upload Resume (PDF/Word)</Label>
            <Input
                id="resume"
                type="file"
                accept=".pdf, .doc, .docx"
                className="bg-white/5 border-white/5 file:bg-primary file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer"
                {...register("resume")}
            />
            {errors.resume && (
                <p className="text-red-500 text-xs">{errors.resume.message}</p>
            )}
          </div>

          {errorApply?.message && (
            <p className="text-red-500 text-sm">{errorApply?.message}</p>
          )}

          {loadingApply && <BarLoader width={"100%"} color="#6366f1" />}

          <DrawerFooter className="px-0 pt-6">
            <Button type="submit" size="lg" className="shadow-lg shadow-indigo-500/20">Submit Application</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="border-slate-800 text-slate-400">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJob;
