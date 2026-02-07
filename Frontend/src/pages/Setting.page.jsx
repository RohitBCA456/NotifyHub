import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  CreditCard, 
  Monitor, 
  Smartphone, 
  LogOut, 
  CheckCircle2,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
      isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className={`text-4xl font-black tracking-tight mb-2 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            Account Settings
          </h1>
          <p className="text-lg opacity-70">Manage your global profile, security, and subscription.</p>
        </div>

        <div className="space-y-6">
          
          {/* Section 1: Appearance & Localization */}
          <div className={`p-6 rounded-3xl border transition-colors ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              <Monitor size={20} className="text-blue-500" /> Appearance & Localization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Language</label>
                <select className={`w-full p-3 rounded-xl border text-sm outline-none ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                }`}>
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Timezone</label>
                <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  <Globe size={16} /> <span>(GMT-08:00) Pacific Time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Active Sessions (Security focus) */}
          <div className={`p-6 rounded-3xl border transition-colors ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              <Shield size={20} className="text-emerald-500" /> Security & Active Sessions
            </h3>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-2xl ${
                isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
              }`}>
                <div className="flex items-center gap-4">
                  <Monitor className="text-blue-500" />
                  <div>
                    <p className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>Chrome on MacOS</p>
                    <p className="text-xs opacity-60">Current Session • San Francisco, USA</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">ACTIVE NOW</span>
              </div>
              <div className={`flex items-center justify-between p-4 rounded-2xl ${
                isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
              }`}>
                <div className="flex items-center gap-4">
                  <Smartphone className="text-slate-400" />
                  <div>
                    <p className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>NotifyHub App (iOS)</p>
                    <p className="text-xs opacity-60">Last active: 2 hours ago • iPhone 15 Pro</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>
              </div>
            </div>
          </div>

          {/* Section 3: Billing & Plan */}
          <div className={`p-6 rounded-3xl border transition-colors ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              <CreditCard size={20} className="text-purple-500" /> Billing & Subscription
            </h3>
            <div className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border-2 border-dashed ${
              isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-blue-100 bg-blue-50/30"
            }`}>
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className={`text-xl font-black ${isDarkMode ? "text-white" : "text-blue-900"}`}>Pro Developer Plan</p>
                <p className="text-sm opacity-70">$19.00 / month • Renews Feb 12, 2026</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                Manage Billing
              </button>
            </div>
            
            <div className="mt-6 flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
              <div className="flex items-center gap-2 whitespace-nowrap text-sm opacity-70">
                <CheckCircle2 size={16} className="text-emerald-500" /> Unlimited Webhooks
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap text-sm opacity-70">
                <CheckCircle2 size={16} className="text-emerald-500" /> 10 Team Members
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap text-sm opacity-70">
                <CheckCircle2 size={16} className="text-emerald-500" /> 30-day History
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6">
            <button className={`w-full flex items-center justify-between p-4 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group`}>
               <div className="flex items-center gap-3">
                 <LogOut className="text-red-500" size={20} />
                 <span className="text-red-500 font-bold">Sign out from all devices</span>
               </div>
               <ChevronRight size={18} className="text-red-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
