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
  Inbox, // Already imported
  Hash,
  LayoutDashboard,
  FileText, // Import this for Docs
  Briefcase, // Import this for Projects
  Info,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useClerk } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../Store/userSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loaderConfig, setLoaderConfig] = useState({ title: "", subtext: "" });
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const { signOut } = useClerk();

  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef({});
  const navigate = useNavigate();

  // UPDATED TABS ARRAY WITH CORRECT ICON COMPONENTS
  const tabs = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: <Briefcase size={16} />,
    },
    { name: "About", path: "/dashboard/about", icon: <Info size={16} /> },
    { name: "Docs", path: "/dashboard/docs", icon: <FileText size={16} /> },
  ];

  useEffect(() => {
    const currentTab =
      tabs.find((tab) => tab.path === location.pathname) || tabs[0];
    const activeElement = tabsRef.current[currentTab.name];

    if (activeElement) {
      setPillStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLoaderConfig({
        title: "Signing out...",
        subtext: "Securing your session and redirecting",
      });
      setIsRedirecting(true);
      setIsProfileOpen(false);

      await fetch("https://notifyhub-backend-gral.onrender.com/api/users/logout", {
        method: "GET",
        credentials: "include",
      });

      dispatch(clearUser());

      await signOut();

      toast.success("Logged out successfully.");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout encountered an issue.");
    } finally {
      setIsRedirecting(false);
    }
  };
  const handleActionNavigation = (path, title, subtext) => {
    setLoaderConfig({ title, subtext });
    setIsRedirecting(true);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      navigate(path);
      setTimeout(() => setIsRedirecting(false), 500);
    }, 800);
  };

  return (
    <>
      {isRedirecting && (
        <Loader
          title={loaderConfig.title}
          subtext={loaderConfig.subtext}
          isDarkMode={isDarkMode}
          fullScreen={true}
        />
      )}

      <nav
        className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-950/80 border-slate-800"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 py-3">
            {/* Logo Section */}
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Bell size={22} className="text-white" />
              </div>
              <p
                className={
                  isDarkMode
                    ? "font-bold text-white"
                    : "font-bold text-blue-400"
                }
              >
                NotifyHub
              </p>
              <span
                className={`text-xl font-black tracking-tight hidden xs:block ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Notify<span className="text-blue-600">Hub</span>
              </span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex justify-center items-center flex-1">
              <div
                className={`relative flex items-center p-1 rounded-2xl border transition-colors ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-700/50"
                    : "bg-slate-100/50 border-slate-200/50"
                }`}
              >
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
                          ? isDarkMode
                            ? "text-white"
                            : "text-blue-600"
                          : isDarkMode
                            ? "text-slate-400 hover:text-slate-200"
                            : "text-slate-600 hover:text-blue-500"
                      }`}
                    >
                      {/* ICON RENDERED HERE */}
                      {tab.icon}
                      {tab.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Tools & Profile */}
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
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-200">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-500">?</div>
                    )}
                  </div>
                  <span
                    className={`hidden lg:block text-sm font-semibold ${
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    {user?.username || user?.email?.split("@")[0] || "User"}
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
                      onClick={() =>
                        handleActionNavigation(
                          "/profile",
                          "Accessing Profile...",
                          "Loading your personal workspace",
                        )
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isDarkMode
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <User size={18} /> Profile
                    </button>
                    <button
                      onClick={() =>
                        handleActionNavigation(
                          "/settings",
                          "Opening Settings...",
                          "Preparing your account configuration",
                        )
                      }
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
                      onClick={handleLogout}
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

        {/* Mobile Menu */}
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
    </>
  );
};

export default Navbar;
