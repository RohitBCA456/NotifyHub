import React from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  MapPin,
  Camera,
  Edit3,
  Trash2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state) => state.user.userData);

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode
          ? "bg-slate-950 text-slate-300"
          : "bg-slate-50 text-slate-600"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div
          className={`rounded-3xl border p-8 mb-8 transition-colors ${
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/20"
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ring-4 ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-black text-slate-600"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  <User size={64} />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-lg">
                <Camera size={16} />
              </button>
            </div>

            {/* User Basic Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1
                  className={`text-3xl font-black ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {user.username}
                </h1>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full border border-blue-500/20">
                  PRO PLAN
                </span>
              </div>
              <p className="text-lg mb-4">Full Stack Developer</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-70">
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} /> Delhi, India
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell size={16} /> Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <button
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isDarkMode
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Strength Meter */}
        <div
          className={`p-4 rounded-2xl mb-8 border border-dashed transition-colors ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/50"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              Profile Strength
            </span>
            <span className="text-xs font-bold text-blue-500">65%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-[12px] mt-2 opacity-50 italic">
            Add a custom bio and location to reach 100%.
          </p>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Details */}
          <div
            className={`p-6 rounded-3xl border transition-colors ${
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              <Mail size={20} className="text-blue-500" /> Account Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Email Address
                </label>
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Username
                </label>
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {user.username}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Timezone
                </label>
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  UTC -8 (Pacific Time)
                </p>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div
            className={`p-6 rounded-3xl border transition-colors ${
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              <Shield size={20} className="text-emerald-500" /> Security
            </h3>
            <div className="space-y-4">
              <button
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "hover:bg-slate-800 border-slate-800"
                    : "hover:bg-slate-50 border-slate-100"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  Two-Factor Authentication
                </p>
                <p className="text-xs opacity-60">
                  Add an extra layer of security
                </p>
              </button>
              <button
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "hover:bg-slate-800 border-slate-800"
                    : "hover:bg-slate-50 border-slate-100"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  Change Password
                </p>
                <p className="text-xs opacity-60">Last changed 3 months ago</p>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className={`mt-12 p-6 rounded-3xl border border-red-500/20 bg-red-500/5 transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-500 font-bold mb-1">Danger Zone</h3>
              <p className="text-sm opacity-70">
                Permanently delete your account and all workspace data.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
