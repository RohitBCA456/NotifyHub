import React, { useState, useEffect } from "react";
import {
  Mail,
  Globe,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { io } from "socket.io-client";
import { config } from "../../config";

const BACKEND_API = config.services.backendService;

// Connect to the /ui namespace defined in your backend
const socket = io(`${BACKEND_API}/ui`, { autoConnect: false });

const NotificationFeed = ({ isDarkMode, projectId }) => {
  const [feedItems, setFeedItems] = useState([]);

  console.log(`projectId: ${projectId}`);

  useEffect(() => {
    // 1. Establish connection and join the user-specific room
    socket.connect();
    socket.emit("join", projectId);

    // 2. Listen for the 'notification_sent' event from your backend
    socket.on("notification_sent", (data) => {
      setFeedItems((prev) => {
        // Use notificationId consistently
        const exists = prev.find(
          (item) => item.notificationId === data.notificationId,
        );

        if (exists) {
          return prev.map((item) =>
            item.notificationId === data.notificationId
              ? { ...item, ...data }
              : item,
          );
        }
        return [data, ...prev].slice(0, 15);
      });
    });
    
    // Cleanup on unmount
    return () => {
      socket.off("notification_update");
      socket.disconnect();
    };
  }, [projectId]);

  return (
    <div
      className={`p-8 rounded-3xl border transition-colors ${
        isDarkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <h3
          className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Live Activity Feed
        </h3>
        <span className="text-[10px] font-bold text-blue-500 animate-pulse tracking-widest">
          ● LIVE STREAMING
        </span>
      </div>
      <div className="space-y-4">
        {feedItems.length === 0 && (
          <p className="text-center py-10 opacity-40 text-sm">
            No activity detected yet...
          </p>
        )}
        {feedItems.map((item) => (
          <div
            key={item.notificationId}
            className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${
              isDarkMode
                ? "bg-slate-800/40 border-slate-800 hover:bg-slate-800/60"
                : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
            }`}
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div
                className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-900 text-blue-400" : "bg-white text-blue-600 shadow-sm"}`}
              >
                {/* Mapping backend 'channel' to frontend icons */}
                {item.channel?.toLowerCase() === "email" ? (
                  <Mail size={18} />
                ) : item.channel?.toLowerCase() === "webhook" ? (
                  <Globe size={18} />
                ) : (
                  <MessageSquare size={18} />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {"System"}
                </p>
                <p className={`text-xs italic opacity-60`}>"{item.message}"</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-8">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  Channel
                </p>
                <p className="text-xs font-bold uppercase">{item.channel}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status} />
                <span className="text-[10px] opacity-40 font-mono">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString()
                    : "Just now"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  const isSent = normalizedStatus === "sent";
  const isProcessing = normalizedStatus === "processing";

  return (
    <span
      className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${
        isSent
          ? "bg-emerald-500/10 text-emerald-500"
          : isProcessing
            ? "bg-blue-500/10 text-blue-500"
            : "bg-red-500/10 text-red-500"
      }`}
    >
      {isProcessing ? (
        <Loader2 size={12} className="animate-spin" />
      ) : isSent ? (
        <CheckCircle2 size={12} />
      ) : (
        <AlertCircle size={12} />
      )}
      {status?.toUpperCase()}
    </span>
  );
};

export default NotificationFeed;
