import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, PenBox, Search, Heart } from "lucide-react";

const Header = () => {
  const { user } = useUser();

  return (
    <nav className="py-4 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 px-6 lg:px-12">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
           <BriefcaseBusiness className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter gradient-text">HireVerse</span>
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/jobs">
           <Button variant="ghost" className="hidden sm:flex gap-2 text-slate-300 hover:text-white hover:bg-white/5">
             <Search className="w-4 h-4" />
             Find Jobs
           </Button>
        </Link>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {user?.unsafeMetadata?.role === "recruiter" && (
            <Link to="/post-job" className="hidden sm:block">
              <Button variant="outline" className="gap-2 border-slate-700 bg-white/5 hover:bg-white/10 text-slate-200">
                <PenBox className="w-4 h-4" />
                Post a Job
              </Button>
            </Link>
          )}
          {user?.unsafeMetadata?.role === "candidate" && (
            <Link to="/saved-jobs" className="hidden sm:block">
              <Button variant="ghost" className="gap-2 text-slate-300 hover:text-white">
                <Heart className="w-4 h-4" />
                Saved Jobs
              </Button>
            </Link>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-primary/20",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
