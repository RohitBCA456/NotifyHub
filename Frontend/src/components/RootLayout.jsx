import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "./../../context/ThemeContext";
import ScrollToTop from "./ScrollTop";

const RootLayout = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950" : "bg-white"
    }`}>
      <ScrollToTop />
      <Navbar />
      {/* This main area grows to push the footer down */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;