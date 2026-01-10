import React from 'react';
import { ChevronRight, Play, Mail, Globe, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

const HeroSectionDashboard = () => {
  const { isDarkMode } = useTheme();

  // Hardcoded notification data for the mockup
  const mockNotifications = [
    { id: 1, app: "E-Commerce Pro", channel: "Email", icon: <Mail size={16} />, time: "Just now" },
    { id: 2, app: "Stripe Payment", channel: "Webhook", icon: <Globe size={16} />, time: "2m ago" },
    { id: 3, app: "Support Desk", channel: "Discord", icon: <MessageSquare size={16} />, time: "5m ago" },
  ];

  return (
    <div className={`relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950" : "bg-white"
    }`}>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${
          isDarkMode ? "bg-blue-600/10" : "bg-blue-500/10"
        }`}></div>
        <div className={`absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] blur-[120px] rounded-full ${
          isDarkMode ? "bg-indigo-600/10" : "bg-indigo-500/10"
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 animate-fade-in ${
            isDarkMode ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-100"
          }`}>
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? "text-blue-400" : "text-blue-700"
            }`}>v2.0 is now live</span>
            <ChevronRight size={14} className="text-blue-400" />
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl font-black tracking-tight mb-6 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            All your notifications. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              One Unified Hub.
            </span>
          </h1>

          {/* Subtext */}
          <p className={`max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            NotifyHub connects your entire tech stack into a single, intelligent feed. 
            Stop hunting through tabs—start shipping faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
              Start Building Free
              <ChevronRight size={20} />
            </button>
            <button className={`w-full sm:w-auto px-8 py-4 font-bold rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              isDarkMode 
                ? "bg-slate-900 text-white border-slate-800 hover:bg-slate-800" 
                : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
            }`}>
              <Play size={18} className="fill-current" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className={`flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 font-bold text-xl italic transition-all ${
            isDarkMode ? "text-white" : "text-slate-800"
          }`}>
            <div>GITHUB</div>
            <div>VERCEL</div>
            <div>SLACK</div>
            <div>DISCORD</div>
          </div>
        </div>

        {/* Visual Mockup Section */}
        <div className="mt-20 relative max-w-4xl mx-auto">
          <div className={`absolute inset-0 z-10 h-full w-full bg-gradient-to-t ${
            isDarkMode ? "from-slate-950 via-transparent to-transparent" : "from-white via-transparent to-transparent"
          }`}></div>
          
          <div className={`rounded-3xl border p-4 shadow-2xl overflow-hidden transition-colors ${
            isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            {/* Mockup Top Bar */}
            <div className={`flex items-center gap-2 mb-4 border-b pb-4 px-2 ${
              isDarkMode ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className={`mx-auto px-4 py-1 rounded-lg text-[10px] font-mono ${
                isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-500"
              }`}>
                app.notifyhub.io/live-feed
              </div>
            </div>

            {/* Dynamic Mockup Lines */}
            <div className="space-y-3 p-2">
              {mockNotifications.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.app}</p>
                      <p className={`text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Channel: {item.channel}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 size={12} /> SENT
                      </span>
                      <span className={`text-[9px] ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDashboard;