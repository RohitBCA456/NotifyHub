import React from "react";
import { Copy, Terminal, Key, Rocket, CheckCircle2, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const HeroSectionDocs = () => {
  const { isDarkMode } = useTheme();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Updated to include Bearer Token and the protected send-notification route
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
    "message": "Your NotifyHub integration is now authenticated and live!"
  }'`;

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <h1
            className={`text-4xl font-black tracking-tight mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Integration Guide
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed">
            Connect your services to NotifyHub using our protected API. 
            Follow these steps to authenticate and start sending multi-channel alerts.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-12">
          {/* Step 1: App Creation */}
          <section className="relative pl-12 border-l-2 border-blue-600/30">
            <div className="absolute -left-[13px] top-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-blue-600/10">
              1
            </div>
            <div className="mb-4">
              <h3
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                <Rocket size={20} className="text-blue-500" /> Create an Application
              </h3>
              <p>
                Go to the <strong>Projects</strong> tab and create a new app. This provides you with a unique <code>appId</code> used to group your notification analytics.
              </p>
            </div>
          </section>

          {/* Step 2: API Keys */}
          <section className="relative pl-12 border-l-2 border-blue-600/30">
            <div className="absolute -left-[13px] top-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-blue-600/10">
              2
            </div>
            <div className="mb-4">
              <h3
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                <Key size={20} className="text-amber-500" /> Obtain Credentials
              </h3>
              <p>
                You need two pieces of information: your <strong>API Key</strong> (from the dashboard) and a <strong>Bearer Token</strong> (JWT) from your login session.
              </p>
              <div
                className={`mt-4 p-3 rounded-xl border flex items-center justify-between font-mono text-sm ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <span className="text-blue-500">nh_live_xxxxxxxxxxxxxxxxxxxx</span>
                <button
                  onClick={() => copyToClipboard("nh_live_xxxxxxxxxxxxxxxxxxxx")}
                  className="hover:text-blue-500 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Step 3: Triggering Notification */}
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
                <Terminal size={20} className="text-emerald-500" /> Protected API Call
              </h3>
              <p className="mb-4">
                Execute a <code>POST</code> request to the <code>send-notification</code> endpoint. Ensure the <code>Authorization</code> header is present.
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
                  Authenticated cURL
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

          {/* Security Alert Box */}
          <div
            className={`p-6 rounded-2xl ml-10 flex items-start gap-4 ${
              isDarkMode
                ? "bg-blue-500/5 border border-blue-500/20"
                : "bg-blue-50 border border-blue-100 shadow-sm"
            }`}
          >
            <ShieldCheck className="text-blue-500 shrink-0" size={24} />
            <div>
              <p
                className={`text-sm font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-800"
                }`}
              >
                JWT Authorization Required
              </p>
              <p className="text-xs mt-1 leading-relaxed opacity-80">
                The <code>send-notification</code> route is protected. You must provide a valid JWT in the format: 
                <code className="ml-1 font-bold">Bearer &lt;token&gt;</code>. Requests missing this header will result in a 
                <span className="ml-1 font-bold">401 Unauthorized</span> response.
              </p>
            </div>
          </div>

          {/* Success Tip */}
          <div
            className={`p-6 rounded-2xl ml-10 flex items-start gap-4 ${
              isDarkMode
                ? "bg-emerald-500/5 border border-emerald-500/20"
                : "bg-emerald-50 border border-emerald-100 shadow-sm"
            }`}
          >
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <div>
              <p
                className={`text-sm font-bold ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-800"
                }`}
              >
                Multi-Channel Ready
              </p>
              <p className="text-xs mt-1 opacity-80">
                The <code>targets</code> object allows you to send the same message to multiple platforms 
                (Email, SMS, Push) in a single API call.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDocs;