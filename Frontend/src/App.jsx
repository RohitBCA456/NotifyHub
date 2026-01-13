import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import RootLayout from "./components/RootLayout";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HeroSectionInbox from "./components/HeroSectionInProjects";
import HeroSectionChannels from "./components/HeroSectionChannels";
import HeroSectionDashboard from "./components/HeroSectionDashboard";
import HeroSectionDocs from "./components/HeroSectionDocs";
import ProfilePage from "./pages/Profile.page";
import CreateProjectPage from "./pages/createProject.page";
import SettingsPage from "./pages/setting.page";
import ViewProject from "./pages/ViewProject.page";
import AppWrapper from "./components/AppWrapper";
import { Navigate } from "react-router-dom";
import NotificationPreferencePage from "./pages/NotificationPreference.page";

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
            path: "channels",
            element: <HeroSectionChannels />,
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
