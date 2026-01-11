import React from 'react';
import { Copy, RefreshCw, Check, ExternalLink } from 'lucide-react';

const ApiKeyDisplay = ({ generatedKey, projectName, isDarkMode, onCopy, onDashboardRedirect }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 w-full animate-in zoom-in duration-500">
      <div className={`p-8 md:p-12 rounded-[40px] border text-center ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl shadow-blue-500/10"
      }`}>
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <Check size={40} className="text-white" />
        </div>

        <h2 className={`text-3xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Project Deployed!
        </h2>
        
        <p className={`mb-10 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Your project <span className="font-bold text-blue-500">"{projectName}"</span> is ready. 
          Use the API key below to authenticate your requests.
        </p>

        <div className="space-y-6 text-left">
          {/* Key Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              App API Key
            </label>
            <div className={`flex items-center justify-between p-4 rounded-2xl border font-mono text-sm ${
              isDarkMode ? "bg-black border-slate-800 text-emerald-400" : "bg-slate-50 border-slate-200 text-blue-600"
            }`}>
              <span className="truncate mr-4">{generatedKey}</span>
              <button 
                onClick={() => onCopy(generatedKey)} 
                className="hover:scale-110 transition-transform p-1 hover:bg-slate-800 rounded-lg"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Security Warning */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isDarkMode ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50 border-blue-100"
          }`}>
            <RefreshCw size={16} className="text-blue-500 mt-1 shrink-0" />
            <p className="text-xs leading-relaxed opacity-70">
              This is a <strong>Secret Key</strong>. For security, we only show it once. 
              Make sure to save it in your environment variables.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10">
          <button 
            onClick={onDashboardRedirect}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            Go to Dashboard
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDisplay;