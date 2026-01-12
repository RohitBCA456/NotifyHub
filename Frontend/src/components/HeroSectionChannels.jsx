import React from 'react';
import { Plus, Search, Hash, Settings, Users, Activity } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";

const HeroSectionChannels = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`pt-24 pb-12 transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950" : "bg-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Hash size={24} />
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                Channels
              </h1>
            </div>
            <p className={`text-lg max-w-2xl ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Organize your notifications by project, team, or priority. 
              Configure custom webhooks and integration rules for each stream.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border transition-all ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            }`}>
              <Settings size={18} />
              Channel Settings
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              <Plus size={18} />
              New Channel
            </button>
          </div>
        </div>

        {/* Stats Row (State-Driven Visuals) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={<Users size={18} />} 
            label="Total Members" 
            value="124" 
            isDarkMode={isDarkMode} 
          />
          <StatCard 
            icon={<Activity size={18} />} 
            label="Daily Alerts" 
            value="1.2k" 
            isDarkMode={isDarkMode} 
          />
          <StatCard 
            icon={<Hash size={18} />} 
            label="Active Channels" 
            value="14" 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Bottom Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search channels by name, description, or tag..."
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-md shadow-slate-200/50"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component for Stats
const StatCard = ({ icon, label, value, isDarkMode }) => (
  <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${
    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
  }`}>
    <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
      {icon}
    </div>
    <div>
      <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default HeroSectionChannels;