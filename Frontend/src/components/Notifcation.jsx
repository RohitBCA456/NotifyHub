import React from 'react';
import { Mail, Globe, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const NotificationFeed = ({ isDarkMode }) => {
  const feedItems = [
    { id: "REQ-101", user: "user_88241", msg: "Login Alert", chan: "Email", status: "Processing", time: "Just now" },
    { id: "REQ-102", user: "user_44120", msg: "Order #22 Shipped", chan: "Webhook", status: "Sent", time: "2m ago" },
    { id: "REQ-103", user: "user_11092", msg: "Welcome to NotifyHub!", chan: "In-App", status: "Sent", time: "5m ago" },
    { id: "REQ-104", user: "user_77215", msg: "Payment Failed", chan: "Email", status: "Failed", time: "12m ago" },
  ];

  return (
    <div className={`p-8 rounded-3xl border transition-colors ${
      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Live Activity Feed</h3>
        <span className="text-[10px] font-bold text-blue-500 animate-pulse tracking-widest">● LIVE STREAMING</span>
      </div>
      <div className="space-y-4">
        {feedItems.map((item) => (
          <div key={item.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${
            isDarkMode ? "bg-slate-800/40 border-slate-800 hover:bg-slate-800/60" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
          }`}>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-900 text-blue-400" : "bg-white text-blue-600 shadow-sm"}`}>
                {item.chan === "Email" ? <Mail size={18} /> : item.chan === "Webhook" ? <Globe size={18} /> : <MessageSquare size={18} />}
              </div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.user}</p>
                <p className={`text-xs italic opacity-60`}>"{item.msg}"</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-8">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Channel</p>
                <p className="text-xs font-bold">{item.chan}</p>
              </div>
              <div className="flex items-center gap-3">
                 <StatusBadge status={item.status} />
                 <span className="text-[10px] opacity-40 font-mono">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${
    status === "Sent" ? "bg-emerald-500/10 text-emerald-500" : 
    status === "Processing" ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
  }`}>
    {status === "Processing" ? <Loader2 size={12} className="animate-spin" /> : status === "Sent" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
    {status.toUpperCase()}
  </span>
);

export default NotificationFeed;