import React from "react";
import { Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";
import UserSync from "../components/UserSync"; // ADD THIS

const RootLayout = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <SignedIn>
        {/* UserSync must be inside SignedIn to have access to the 'user' object */}
        <UserSync /> 
        
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
          isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"
        }`}>
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default RootLayout;