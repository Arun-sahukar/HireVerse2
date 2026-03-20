import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import JobListing from "./pages/job-listing";
import JobPage from "./pages/job";
import PostJob from "./pages/post-job";
import SavedJobs from "./pages/saved-jobs";
import MyJobs from "./pages/my-jobs";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
             <ProtectedRoute>
                 <Onboarding />
             </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
             <ProtectedRoute>
                 <JobListing />
             </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
             <ProtectedRoute>
                 <JobPage />
             </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
             <ProtectedRoute>
                 <PostJob />
             </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
             <ProtectedRoute>
                 <SavedJobs />
             </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
             <ProtectedRoute>
                 <MyJobs />
             </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
            colorPrimary: "#6366f1",
        }
      }} 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}

export default App;
