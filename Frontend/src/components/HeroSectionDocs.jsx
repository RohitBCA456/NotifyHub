import React from "react";
import { Copy, Terminal, Key, Rocket, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const HeroSectionDocs = () => {
  const { isDarkMode } = useTheme();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Updated to include Bearer Token and specific protected route
  const codeSnippet = `curl -X POST https://notifyhub-backend-gral.onrender.com/api/notifications/send-notification \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "appId": "your_app_id",
    "channels": ["email", "sms"],
    "targets": {
      "email": "user@example.com",
      "sms": "+1234567890"
    },
    "subject": "Security Alert",
    "message": "A new login was detected on your account."
  }'`;

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center md:text-left">
          <h1
            className={`text-4xl font-black tracking-tight mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Integration Guide
          </h1>
          <p className="text-lg max-w-2xl">
            Our API uses dual-layer security: an **API Key** for project routing and a **Bearer Token** for user authentication.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-12">
          {/* Step 1 & 2 remain similar... */}
          
          {/* Updated Step 3 */}
          <section className="relative pl-12">
            <div className="absolute -left-[13px] top-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-blue-600/10">
              3
            </div>
            <div className="mb-6">
              <h3
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                <Terminal size={20} className="text-emerald-500" /> Trigger a Notification
              </h3>
              <p className="mb-4">
                Include your **JWT** in the Authorization header. This ensures the request is coming from a verified session.
              </p>
            </div>

            {/* Code Block */}
            <div
              className={`rounded-2xl border overflow-hidden ${
                isDarkMode
                  ? "bg-[#0d1117] border-slate-800"
                  : "bg-slate-900 border-slate-950 shadow-2xl"
              }`}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Secure Request
                </span>
              </div>
              <div className="p-6 relative group">
                <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {codeSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeSnippet)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Warning/Info Box */}
          <div
            className={`p-6 rounded-2xl ml-10 flex items-start gap-4 ${
              isDarkMode
                ? "bg-blue-500/5 border border-blue-500/20"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <Key className="text-blue-500 shrink-0" size={24} />
            <div>
              <p
                className={`text-sm font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-800"
                }`}
              >
                Authentication Required
              </p>
              <p className="text-xs text-blue-600/80">
                The <code>Authorization</code> header must follow the <code>Bearer &lt;token&gt;</code> format. Requests without a valid token will return a <code>401 Unauthorized</code> status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDocs;