import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import RootLayout from "./components/RootLayout";
import LoginPage from "./pages/Login.page";
import HeroSectionInbox from "./components/HeroSectionInProjects";
import HeroSectionChannels from "./components/HeroSectionChannels";
import HeroSectionDashboard from "./components/HeroSectionDashboard";

const router = createBrowserRouter([
  {
    // Login page usually doesn't have the main navbar/footer
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <RootLayout />, // The persistent shell
    children: [
      {
        index: true, // This shows when you hit /dashboard exactly
        element: <HeroSectionDashboard />,
      },
      {
        path: "projects", // Result: /dashboard/inbox
        element: <HeroSectionInbox />,
      },
      {
        path: "channels", // Result: /dashboard/channels
        element: <HeroSectionChannels />,
      },
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