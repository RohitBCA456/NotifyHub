import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ 
  title = "Loading...", 
  subtext = "Please wait a moment", 
  isDarkMode = true,
  fullScreen = false 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full transition-all animate-in fade-in zoom-in duration-500 ${
      fullScreen ? "fixed inset-0 z-[100]" : "max-w-md mx-auto px-4"
    } ${
      fullScreen && (isDarkMode ? "bg-slate-950" : "bg-slate-50")
    }`}>
      {/* Animated Icon with Glow */}
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
        <Loader2 
          size={fullScreen ? 64 : 48} 
          className="text-blue-600 animate-spin relative z-10" 
        />
      </div>

      {/* Text Content */}
      <h2 className={`text-2xl font-black mb-2 tracking-tight ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}>
        {title}
      </h2>
      <p className={`text-sm opacity-60 ${
        isDarkMode ? "text-slate-400" : "text-slate-500"
      }`}>
        {subtext}
      </p>
    </div>
  );
};

export default Loader;