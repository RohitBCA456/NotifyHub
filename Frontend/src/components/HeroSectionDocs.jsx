import React from "react";
import { Copy, Terminal, Key, Rocket, Code2, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const HeroSectionDocs = () => {
  const { isDarkMode } = useTheme();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const codeSnippet = `curl -X POST https://api.notifyhub.io/v1/send \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "appId": "your_app_id",
    "message": "Hello from Webhook!",
    "channel": "email"
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
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                <Rocket size={20} className="text-blue-500" /> Create an
                Application
              </h3>
              <p>
                Navigate to the <strong>Projects</strong> and click on "Create
                New Project". This will generate a unique <code>appId</code> for
                your specific workspace.
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
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                <Key size={20} className="text-amber-500" /> Get your API Key
              </h3>
              <p>
                Once your project is created, your <strong>API Key</strong> is
                generated immediately. You can also find it later by clicking
                the <strong>three dots (⋮)</strong>. This key must be
                included in the <code>x-api-key</code> header for every request.
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
                className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                <Terminal size={20} className="text-emerald-500" /> Send your
                first Webhook
              </h3>
              <p>
                Use the following POST request to send data. Replace the headers
                with your credentials.
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
                className={`text-sm font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-800"}`}
              >
                Verification Tip
              </p>
              <p className="text-xs text-emerald-600/80">
                You can monitor the status of your requests in the "Inbox" tab
                in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDocs;
