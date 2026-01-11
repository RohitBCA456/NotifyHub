import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import RootLayout from "./components/RootLayout";
import LoginPage from "./pages/Login.page";
import HeroSectionInbox from "./components/HeroSectionInProjects";
import HeroSectionChannels from "./components/HeroSectionChannels";
import HeroSectionDashboard from "./components/HeroSectionDashboard";
import HeroSectionDocs from "./components/HeroSectionDocs";
import ProfilePage from "./pages/Profile.page";
import CreateProjectPage from "./pages/createProject.page";
import SettingsPage from "./pages/setting.page";
import ViewProject from "./pages/ViewProject.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
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
    path: "viewProject",
    element: <ViewProject />,
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
