import React, { useState } from 'react';
import { Key, Copy, Eye, EyeOff, ShieldCheck, X, Check } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";

const ViewApiKey = ({ isOpen, onClose, projectName }) => {
  const { isDarkMode } = useTheme();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hardcoded mock key
  const apiKey = "nh_live_7721x_9902l_v2_secret_key";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className={`relative w-full max-w-md rounded-[32px] border p-8 shadow-2xl animate-in zoom-in duration-300 ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-slate-800 text-slate-500" : "hover:bg-slate-100 text-slate-400"
          }`}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 ring-8 ring-blue-500/5">
            <Key size={32} />
          </div>
          <h2 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Project API Key
          </h2>
          <p className="text-sm opacity-50 font-medium">
            Workspace: <span className="text-blue-500">{projectName}</span>
          </p>
        </div>

        {/* Key Display Area */}
        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              Secret Key
            </label>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border font-mono text-sm transition-all ${
              isDarkMode ? "bg-black/50 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
            }`}>
              <div className="flex-1 truncate">
                {showKey ? apiKey : "••••••••••••••••••••••••••••••••"}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm"}`}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button 
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all ${
                    copied ? "text-emerald-500" : (isDarkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm")
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className={`flex gap-3 p-4 rounded-2xl border ${
            isDarkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50 border-emerald-100"
          }`}>
            <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
            <div>
              <p className={`text-[11px] font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                KEY IS ACTIVE
              </p>
              <p className="text-[10px] opacity-60 leading-relaxed">
                This key allows authentication for all webhooks in this project. Never expose it in client-side code.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ViewApiKey;