import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import RootLayout from "./components/RootLayout.jsx";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HeroSectionInbox from "./components/HeroSectionInProjects.jsx";
import HeroSectionDashboard from "./components/HeroSectionDashboard.jsx";
import HeroSectionDocs from "./components/HeroSectionDocs.jsx";
import ProfilePage from "./pages/Profile.page";
import CreateProjectPage from "./pages/CreateProject.page.jsx";
import SettingsPage from "./pages/Setting.page.jsx";
import ViewProject from "./pages/ViewProject.page.jsx";
import AppWrapper from "./components/AppWrapper.jsx";
import { Navigate } from "react-router-dom";
import NotificationPreferencePage from "./pages/NotificationPreference.page.jsx";
import AboutUs from "./components/HeroSectionAboutUs.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        path: "/",
        element: (
          <>
            <SignedIn>
              {/* If signed in, automatically move them to the dashboard */}
              <Navigate to="/dashboard" replace />
            </SignedIn>
            <SignedOut>
              {/* If signed out, force the Clerk Auth screen */}
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      {
        path: "/dashboard",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HeroSectionDashboard />,
          },
          {
            path: "projects",
            element: <HeroSectionInbox />,
          },
          {
            path: "about",
            element: <AboutUs />,
          },
          {
            path: "docs",
            element: <HeroSectionDocs />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "createProject",
        element: <CreateProjectPage />,
      },
      {
        path: "viewProject/:projectId",
        element: <ViewProject />,
      },
      {
        path: "updatePreference/:appId",
        element: <NotificationPreferencePage />
      }
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
