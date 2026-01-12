import React from 'react';
import { useTheme } from "../context/ThemeContext";
import { Zap, Activity, CheckCircle2, Clock } from 'lucide-react';
import AnalyticsChart from '../components/Chart';
import NotificationFeed from '../components/Notifcation';

const ViewProjectPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
      isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Production API
              </h1>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                isDarkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </div>
            </div>
            <p className={`text-sm opacity-60`}>Real-time monitoring for your webhook infrastructure.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95">
            <Zap size={18} /> Test Webhook
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Activity />} label="Total Sent" value="84,209" isDarkMode={isDarkMode} />
          <StatCard icon={<CheckCircle2 />} label="Success Rate" value="99.9%" isDarkMode={isDarkMode} />
          <StatCard icon={<Clock />} label="Avg. Latency" value="84ms" isDarkMode={isDarkMode} />
        </div>

        {/* Graphs and Charts */}
        <div className="mb-10">
          <AnalyticsChart isDarkMode={isDarkMode} />
        </div>

        {/* Real-time Activity Feed */}
        <div className="mb-10">
          <NotificationFeed isDarkMode={isDarkMode} />
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, isDarkMode }) => (
  <div className={`p-6 rounded-3xl border transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
    <div className="text-blue-500 mb-4">{icon}</div>
    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">{label}</p>
    <p className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{value}</p>
  </div>
);

export default ViewProjectPage;