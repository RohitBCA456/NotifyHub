import React from "react";
import { Hash, Users, Activity, Shield, Globe, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../components/Loader";

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["globalStats"],
    queryFn: async () => {
      try {
        const cacheRes = await axios.get(
          "https://notifyhub-backend-gral.onrender.com/api/analytics/cache-globalStats",
          { withCredentials: true },
        );

        console.log("cache hit");

        return cacheRes.data;
      } catch (error) {
        console.log("cache Miss");

        if (error.response?.status === 404) {
          const dbRes = await axios.get(
            "https://notifyhub-backend-gral.onrender.com/api/analytics/stats",
            { withCredentials: true },
          );

          return dbRes.data;
        }

        throw error;
      }
    },

    staleTime: 5 * 60 * 1000,
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} /> Our Mission
          </div>
          <h1
            className={`text-4xl md:text-6xl font-black tracking-tight mb-6 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Powering Real-Time <br />
            <span className="text-blue-600">Communication.</span>
          </h1>
          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            NotifyHub is the central nervous system for your technical stack. We
            bridge the gap between your applications and your team.
          </p>
        </div>

        {/* Dynamic Stats Row - Using Live Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatCard
            icon={<Users size={24} />}
            label="Total Members"
            value={`${formatNumber(stats?.totalMembers)}+`}
            description="Developers and teams worldwide"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Hash size={24} />}
            label="Active Channels"
            value={formatNumber(stats?.activeChannels)}
            description="Unique data streams monitored"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Activity size={24} />}
            label="Total Alerts"
            value={formatNumber(stats?.totalNotifications)}
            description="Webhooks delivered to date"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Values Section */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-[40px] border ${
            isDarkMode
              ? "bg-slate-900/50 border-slate-800"
              : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          }`}
        >
          <div>
            <h2
              className={`text-3xl font-black mb-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Why Teams Choose <br />
              NotifyHub?
            </h2>
            <div className="space-y-6">
              <ValueItem
                icon={<Shield className="text-emerald-500" />}
                title="Secure by Design"
                text="End-to-end encryption for every webhook payload."
                isDarkMode={isDarkMode}
              />
              <ValueItem
                icon={<Globe className="text-blue-500" />}
                title="Global Infrastructure"
                text="Low-latency delivery nodes across 12 global regions."
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-8 shadow-2xl">
              <div className="text-white text-center">
                <Activity
                  size={64}
                  className="mx-auto mb-4 opacity-50 animate-pulse"
                />
                <p className="text-2xl font-bold italic">
                  "Reliability in every packet."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Refined Stat Card
const StatCard = ({ icon, label, value, description, isDarkMode }) => (
  <div
    className={`p-8 rounded-[32px] border transition-all hover:-translate-y-1 ${
      isDarkMode
        ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80"
        : "bg-white border-slate-200 shadow-sm hover:shadow-xl"
    }`}
  >
    <div
      className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}
    >
      {icon}
    </div>
    <p
      className={`text-4xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
    >
      {value}
    </p>
    <p
      className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
    >
      {label}
    </p>
    <p
      className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
    >
      {description}
    </p>
  </div>
);

// Value Item for lower section
const ValueItem = ({ icon, title, text, isDarkMode }) => (
  <div className="flex gap-4">
    <div className="shrink-0">{icon}</div>
    <div>
      <h4
        className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h4>
      <p
        className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        {text}
      </p>
    </div>
  </div>
);

export default AboutUs;
