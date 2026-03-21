import React, { useState, useEffect, useCallback, useRef } from "react";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { config } from "../../config";

const BACKEND_API = config.services.backendService;

// Move socket outside or use a ref to prevent multiple connections on re-render
const socket = io(`${BACKEND_API}/ui`, { autoConnect: false });

const AnalyticsChart = ({ isDarkMode, currentUserId }) => {
  const { projectId } = useParams();
  const [hoveredData, setHoveredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({ volume: [], channels: [] });

  // Helper to transform raw DB stats into UI-ready data
  const transformData = useCallback((rawData) => {
    if (!rawData) return;

    // Transform Hourly Volume
    const maxVal = Math.max(...rawData.hourlyVolume.map((h) => h.count), 1);
    const normalizedVolume = rawData.hourlyVolume.map(
      (h) => (h.count / maxVal) * 100,
    );

    // Transform Channel Mix
    const total = rawData.channelMix.reduce((acc, curr) => acc + curr.count, 0);
    let currentOffset = 0;
    const colors = { email: "#3b82f6", inapp: "#6366f1", sms: "#ec4899" };
    const bgColors = {
      email: "bg-blue-500",
      inapp: "bg-indigo-500",
      sms: "bg-pink-500",
    };

    const transformedChannels = rawData.channelMix.map((ch) => {
      const percentage = total > 0 ? Math.round((ch.count / total) * 100) : 0;
      const strokeDash = `${percentage} 100`;
      const offset = currentOffset;
      currentOffset -= percentage;

      return {
        label: ch._id.charAt(0).toUpperCase() + ch._id.slice(1),
        value: percentage,
        count: ch.count,
        strokeDash,
        offset: offset.toString(),
        color: colors[ch._id.toLowerCase()] || "#94a3b8",
        bg: bgColors[ch._id.toLowerCase()] || "bg-slate-400",
      };
    });

    setChartData({
      volume: normalizedVolume,
      channels: transformedChannels,
    });
  }, []);

  // 1. Initial Fetch (On Page Load/Refresh)
  const fetchInitialData = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_API}/api/analytics/chart-data/${projectId}`,
      );
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      transformData(data);
    } catch (err) {
      console.error("Initial load failed", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, transformData]);

  // 2. Socket Connection & Real-time Listeners
  useEffect(() => {
    socket.connect();
    socket.emit("join", projectId);

    // Initial load
    fetchInitialData();

    // Listen for real-time updates (No more polling!)
    socket.on("stats_updated", (newData) => {
      // Access specifically the notification stats data
      const notificationData = newData.notificationStats;

      console.log("Notification Stats only:", notificationData);

      // Pass only the notification data to your transform function
      transformData(notificationData);
    });

    return () => {
      socket.off("stats_updated");
      socket.disconnect();
    };
  }, [currentUserId, fetchInitialData, transformData]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Bar Chart Section */}
      <div
        className={`lg:col-span-8 p-8 rounded-3xl border transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-10 flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          <BarChart3 size={20} className="text-blue-500" /> Delivery Volume
          (24h)
        </h3>

        <div className="flex items-end justify-between h-64 gap-2 px-2 border-b border-slate-500/10">
          {chartData.volume.map((val, i) => (
            <div
              key={i}
              className="flex-1 h-full flex flex-col justify-end items-center group"
            >
              <div
                className="w-full max-w-[32px] bg-blue-600/40 group-hover:bg-blue-600 transition-all rounded-t-md relative cursor-help"
                style={{ height: `${val}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50">
                  {Math.round(val)}% Intensity
                </div>
              </div>
              <span className="text-[10px] font-bold opacity-30 mt-2">
                H{i}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Section */}
      <div
        className={`lg:col-span-4 p-8 rounded-3xl border transition-colors ${
          isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-8 flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          <PieChartIcon size={20} className="text-indigo-500" /> Channel Mix
        </h3>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full -rotate-90 rounded-full"
          >
            {chartData.channels.map((chan) => (
              <circle
                key={chan.label}
                r="16"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={chan.color}
                strokeWidth="32"
                strokeDasharray={chan.strokeDash}
                strokeDashoffset={chan.offset}
                style={{ pointerEvents: "stroke" }}
                className="cursor-pointer hover:opacity-80 transition-all"
                onMouseEnter={() =>
                  setHoveredData({ label: chan.label, value: chan.value })
                }
                onMouseLeave={() => setHoveredData(null)}
              />
            ))}
            <circle
              r="12"
              cx="16"
              cy="16"
              fill={isDarkMode ? "#020617" : "#ffffff"}
              className="pointer-events-none"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredData ? (
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">
                  {hoveredData.label}
                </p>
                <p
                  className={`text-2xl font-black ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {hoveredData.value}%
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p
                  className={`text-xl font-black ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Channels
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {chartData.channels.map((ch) => (
            <div key={ch.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${ch.bg}`}></div>
              <span className="text-xs font-bold opacity-60">{ch.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
