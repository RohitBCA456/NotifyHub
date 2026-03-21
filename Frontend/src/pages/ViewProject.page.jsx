import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { Zap, Activity, CheckCircle2 } from "lucide-react";
import AnalyticsChart from "../components/Chart";
import NotificationFeed from "../components/Notifcation";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { config } from "../../config";

const BACKEND_API = config.services.backendService;

const socket = io(`${BACKEND_API}/ui`, { autoConnect: false });

const ViewProjectPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [stats, setStats] = useState({ totalSent: "0", successRate: "0%" });
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  let userId = localStorage.getItem("userId");
  // 1. Initial Fetch (Runs only once on load or projectId change)
  const fetchInitialStats = useCallback(async () => {
    try {
      setLoading(true);

      // STEP 1: Try Redis cache first
      let response = await fetch(
        `${BACKEND_API}/api/analytics/project-cache/${projectId}`,
      );

      // STEP 2: If cache hit
      if (response.ok) {
        const data = await response.json();

        console.log("Cache hit", data);

        setStats({
          totalSent: data.totalSent,
          successRate: data.successRate,
        });
      }

      // STEP 3: Cache miss → Fetch DB
      else {
        console.log("Cache miss → Fetching DB");

        response = await fetch(
          `${BACKEND_API}/api/analytics/project-stats/${projectId}`,
        );

        const data = await response.json();

        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 2. Socket Connection & Real-time Listeners
  useEffect(() => {
    // Connect and Join the room for this specific project
    socket.connect();
    socket.emit("join", projectId);

    // Initial load
    fetchInitialStats();

    // Listen for real-time updates
    socket.on("stats_updated", (newData) => {
      console.log("Real-time update received:", newData);

      // Accessing the specific notification stats from the nested object
      if (newData.projectStats) {
        const { total, successRate } = newData.projectStats;

        console.log("Updating stats with:", { total, successRate });

        setStats({
          totalSent: total.toString(),
          successRate: `${successRate.toFixed(1)}%`,
        });
      }
    });

    // CLEANUP: Unsubscribe from event and leave room
    return () => {
      socket.off("stats_updated");
      // Optional: socket.emit("leave", projectId);
    };
  }, [projectId, fetchInitialStats]);

  const handleUpdatePreference = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/updatePreference/${projectId}`);
    }, 1000);
  };

  if (isNavigating) {
    return (
      <Loader
        title="Loading Preferences..."
        subtext="Fetching your notification settings"
        isDarkMode={isDarkMode}
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen ${
        isDarkMode
          ? "bg-slate-950 text-slate-300"
          : "bg-slate-50 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1
                className={`text-4xl font-black tracking-tight ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Production API
              </h1>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                  isDarkMode
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </div>
            </div>
            <p className="text-sm opacity-60">
              Real-time monitoring for your webhook infrastructure.
            </p>
          </div>

          <button
            onClick={handleUpdatePreference}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95"
          >
            <Zap size={18} /> Update Preferences
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard
            icon={<Activity />}
            label="Total Notifications"
            value={loading ? "..." : stats.totalSent}
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<CheckCircle2 />}
            label="Success Rate"
            value={loading ? "..." : stats.successRate}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Graphs and Charts */}
        <div className="mb-10">
          <AnalyticsChart isDarkMode={isDarkMode} currentUserId={userId} />
        </div>

        {/* Real-time Activity Feed */}
        <div className="mb-10">
          <NotificationFeed isDarkMode={isDarkMode} currentUserId={userId} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, isDarkMode }) => (
  <div
    className={`p-6 rounded-3xl border transition-colors ${
      isDarkMode
        ? "bg-slate-900 border-slate-800"
        : "bg-white border-slate-200 shadow-sm"
    }`}
  >
    <div className="text-blue-500 mb-4">{icon}</div>
    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
      {label}
    </p>
    <p
      className={`text-3xl font-black ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default ViewProjectPage;
