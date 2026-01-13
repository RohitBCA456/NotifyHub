import React, { useState, useEffect, useMemo } from "react";
import { Mail, MessageSquare, Layout, Bell, Save } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const NotificationPreferencePage = () => {
  const { isDarkMode } = useTheme();
  const { appId } = useParams();
  const queryClient = useQueryClient();

  const [prefs, setPrefs] = useState({
    email: false,
    sms: false,
    inapp: false,
  });

  // 1. Fetch existing preferences
  const { data: serverData, isLoading } = useQuery({
    queryKey: ["preferences", appId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/notifications/get-preferences/${appId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!appId,
  });

  // Sync state when data arrives
  useEffect(() => {
    if (serverData?.preferences) {
      setPrefs(serverData.preferences);
    }
  }, [serverData]);

  // 2. Change Detection Logic
  const hasChanges = useMemo(() => {
    if (!serverData?.preferences) return false;
    
    return (
      prefs.email !== serverData.preferences.email ||
      prefs.sms !== serverData.preferences.sms ||
      prefs.inapp !== serverData.preferences.inapp
    );
  }, [prefs, serverData]);

  // 3. Mutation to save preferences
  const mutation = useMutation({
    mutationFn: async (newPrefs) => {
      return await axios.post(
        "http://localhost:3000/api/notifications/update-preferences",
        { appId, preferences: newPrefs },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["preferences", appId]);
      toast.success("Settings updated successfully!");
    },
    onError: () => {
      toast.error("Failed to save settings.");
    }
  });

  const togglePref = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    mutation.mutate(prefs);
  };

  return (
    <div className={`pt-24 pb-20 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Bell size={24} />
            </div>
            <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Delivery Channels
            </h1>
          </div>
          <p className="text-lg opacity-70 max-w-2xl">
            Configure how NotifyHub reaches you for this specific application.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <PreferenceCard 
            icon={<Mail size={24} />}
            title="Email Notifications"
            active={prefs.email}
            onClick={() => togglePref("email")}
            isDarkMode={isDarkMode}
            colorClass="text-blue-500"
            bgClass="bg-blue-500/10"
          />

          <PreferenceCard 
            icon={<MessageSquare size={24} />}
            title="SMS Messages"
            active={prefs.sms}
            onClick={() => togglePref("sms")}
            isDarkMode={isDarkMode}
            colorClass="text-emerald-500"
            bgClass="bg-emerald-500/10"
          />

          <PreferenceCard 
            icon={<Layout size={24} />}
            title="Dashboard Alerts"
            active={prefs.inapp}
            onClick={() => togglePref("inapp")}
            isDarkMode={isDarkMode}
            colorClass="text-amber-500"
            bgClass="bg-amber-500/10"
          />

          <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-slate-800">
            <button
              onClick={handleSave}
              // DISABLED LOGIC: Button is disabled if no changes OR if saving is in progress
              disabled={!hasChanges || mutation.isPending}
              className={`px-8 py-3 font-bold rounded-2xl flex items-center gap-2 transition-all active:scale-95 ${
                !hasChanges || mutation.isPending
                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 shadow-none" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20"
              }`}
            >
              <Save size={18} />
              {mutation.isPending ? "Saving..." : "Apply Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceCard = ({ icon, title, active, onClick, isDarkMode, colorClass, bgClass }) => (
  <div className={`p-6 rounded-[32px] border transition-all ${
    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}>{icon}</div>
        <div><h3 className="font-bold">{title}</h3></div>
      </div>
      <button
        onClick={onClick}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${active ? "bg-indigo-600" : "bg-slate-700"}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${active ? "left-8" : "left-1"}`} />
      </button>
    </div>
  </div>
);

export default NotificationPreferencePage;