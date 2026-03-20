import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grid-background pointer-events-none"></div>
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8 relative">
        <Outlet />
      </main>
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-md text-center mt-auto">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">HireVerse</span>. 
          Professional Career Portal. Built for the future.
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
