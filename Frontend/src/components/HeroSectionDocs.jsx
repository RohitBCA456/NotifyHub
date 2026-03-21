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

  // Updated to match your createNotification controller logic
  const codeSnippet = `curl -X POST https://notifyhub-backend-gral.onrender.com/api/notifications \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "appId": "your_app_id",
    "channels": ["email", "sms"],
    "targets": {
      "email": "user@example.com",
      "sms": "+1234567890"
    },
    "subject": "Welcome to NotifyHub",
    "message": "Your integration is working perfectly!"
  }'`;

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode
          ? "bg-slate-950 text-slate-300"
          : "bg-slate-50 text-slate-600"
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
          <p className="text-lg max-w-2xl">
            Get your project connected to NotifyHub in less than 2 minutes.
            Follow these three steps to start sending automated notifications.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-12">
          {/* Step 1 */}
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
                <Rocket size={20} className="text-blue-500" /> Create an
                Application
              </h3>
              <p>
                Navigate to <strong>Projects</strong> and click "Create
                New Project". This generates the <code>appId</code> required to
                route your notifications.
              </p>
            </div>
          </section>

          {/* Step 2 */}
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
                <Key size={20} className="text-amber-500" /> Secure your API Key
              </h3>
              <p>
                Copy your <strong>API Key</strong> from the project dashboard. 
                This must be passed in the <code>x-api-key</code> header.
              </p>
              <div
                className={`mt-4 p-3 rounded-xl border flex items-center justify-between font-mono text-sm ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <span className="text-blue-500">
                  nh_live_xxxxxxxxxxxxxxxxxxxx
                </span>
                <button
                  onClick={() =>
                    copyToClipboard("nh_live_xxxxxxxxxxxxxxxxxxxx")
                  }
                  className="hover:text-blue-500"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Step 3 */}
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
              <p>
                Send a POST request to our API. You can target multiple channels 
                (email, sms, push) in a single call.
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
                  cURL Request
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

          {/* Integration Success Tip */}
          <div
            className={`p-6 rounded-2xl ml-10 flex items-start gap-4 ${
              isDarkMode
                ? "bg-emerald-500/5 border border-emerald-500/20"
                : "bg-emerald-50 border border-emerald-100"
            }`}
          >
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <div>
              <p
                className={`text-sm font-bold ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-800"
                }`}
              >
                Multi-Channel Support
              </p>
              <p className="text-xs text-emerald-600/80">
                The <code>targets</code> object maps channel names to their 
                respective destinations (e.g., email addresses or phone numbers).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDocs;