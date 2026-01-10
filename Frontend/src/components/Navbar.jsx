import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Inbox,
  Hash,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation(); // Listen to URL changes

  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef({});

  const tabs = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Projects", path: "/dashboard/projects", icon: <Inbox size={16} /> },
    { name: "Channels", path: "/dashboard/channels", icon: <Hash size={16} /> },
  ];

  // Calculate pill position based on the current URL
  useEffect(() => {
    // Find the current tab object based on the URL path
    const currentTab = tabs.find(tab => tab.path === location.pathname) || tabs[0];
    const activeElement = tabsRef.current[currentTab.name];
    
    if (activeElement) {
      setPillStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [location.pathname]); // Re-run whenever the URL changes

  return (
    <nav
      className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-950/80 border-slate-800"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 py-3">
          
          {/* 1. Left: Logo Section */}
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Bell size={22} className="text-white" />
            </div>
            <h1 className={isDarkMode ? "text-white font-bold" : "text-grey font-bold"}>NotifyHub</h1>
            <span
              className={`text-xl font-black tracking-tight hidden xs:block ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Notify<span className="text-blue-600">Hub</span>
            </span>
          </div>

          {/* 2. Center: Desktop Navigation with SLIDING PILL */}
          <div className="hidden md:flex justify-center items-center flex-1">
            <div
              className={`relative flex items-center p-1 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-700/50"
                  : "bg-slate-100/50 border-slate-200/50"
              }`}
            >
              {/* The Sliding Pill Background */}
              <div
                className={`absolute h-[calc(100%-8px)] shadow-sm rounded-xl transition-all duration-300 ease-in-out ${
                  isDarkMode ? "bg-slate-700" : "bg-white"
                }`}
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                }}
              />

              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;

                return (
                  <Link
                    key={tab.name}
                    to={tab.path}
                    ref={(el) => (tabsRef.current[tab.name] = el)}
                    className={`relative z-10 px-5 py-2 text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                      isActive
                        ? isDarkMode ? "text-white" : "text-blue-600"
                        : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-blue-500"
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Right: Tools & Profile */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div
              className={`h-8 w-[1px] hidden sm:block ${
                isDarkMode ? "bg-slate-800" : "bg-slate-200"
              }`}
            ></div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1 pr-1 sm:pr-3 rounded-full transition-all hover:ring-2 ring-blue-500/30 ${
                  isDarkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  JD
                </div>
                <span
                  className={`hidden lg:block text-sm font-semibold ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  John Doe
                </span>
              </button>

              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-3 w-56 border rounded-2xl shadow-2xl py-2 z-50 transition-colors ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <User size={18} /> Profile
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Settings size={18} /> Settings
                  </button>
                  <div
                    className={`h-[1px] my-1 ${
                      isDarkMode ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  ></div>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => console.log("Logging out...")}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-4 space-y-2 transition-colors ${
            isDarkMode
              ? "bg-slate-950 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.name}
                to={tab.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : isDarkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.icon}
                {tab.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;