import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Users, Zap, ShieldCheck, Globe } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import companies from "@/data/companies.json";
import faqs from "@/data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
          <Zap className="w-4 h-4" />
          <span>The Next Generation of Hiring is Here</span>
        </div>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
          Find Your <span className="gradient-text">Dream Career</span> <br /> 
          with Precision.
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          HireVerse connects the world's best talent with top-tier companies. 
          Streamlined applications, AI-powered matching, and direct communication.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/jobs">
            <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              Explore Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-700 bg-white/5 hover:bg-white/10">
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            { icon: <BriefcaseBusiness />, title: "10k+ Active Jobs", desc: "Opportunities across all sectors and levels." },
            { icon: <Users />, title: "2M+ Candidates", desc: "A massive pool of verified professional talent." },
            { icon: <Globe />, title: "Remote Friendly", desc: "Work from anywhere with top global companies." }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col gap-4 text-left">
              <div className="bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
      </section>

      {/* Company Carousel */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
         <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
          >
            <CarouselContent className="flex gap-10 sm:gap-20 items-center">
              {companies.map(({ name, id, path }) => (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                  <img
                    src={path}
                    alt={name}
                    className="h-9 sm:h-14 object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
      </section>

      {/* CTA Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass-card p-10 rounded-3xl flex flex-col gap-6 group">
             <h2 className="text-3xl font-bold">For Job Seekers</h2>
             <p className="text-slate-400">Search for jobs, apply with ease, and track your applications in one place.</p>
             <Link to="/jobs">
               <Button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white">Find Jobs</Button>
             </Link>
          </div>
          <div className="glass-card p-10 rounded-3xl flex flex-col gap-6">
             <h2 className="text-3xl font-bold">For Recruiters</h2>
             <p className="text-slate-400">Post jobs, manage applications, and find the perfect fit for your team.</p>
             <Link to="/post-job">
               <Button variant="outline" className="w-fit border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10">Post a Job</Button>
             </Link>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto w-full">
         <h2 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
         <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 rounded-xl px-4 bg-white/5">
                <AccordionTrigger className="text-left py-6 hover:no-underline font-semibold text-slate-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
      </section>
    </div>
  );
};

export default LandingPage;
