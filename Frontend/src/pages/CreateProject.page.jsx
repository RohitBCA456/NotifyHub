import React, { useState } from "react";
import {
  Rocket,
  Mail,
  Smartphone,
  MessageSquare,
  ArrowRight,
  Check,
  Moon,
  Clock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
import Loader from "../components/Loader";
import axios from "axios";
import toast from "react-hot-toast";

const CreateProjectPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Step 1: Form | Step 2: Loading | Step 3: Success
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [preferences, setPreferences] = useState({
    email: false,
    inApp: false,
    sms: false,
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "08:00",
  });

  const [generatedKey, setGeneratedKey] = useState("");

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuietHoursToggle = () => {
    setQuietHours((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleCreate = async () => {
    if (!projectName) return toast.error("Please enter a project name");

    const selectedChannels = Object.keys(preferences).filter(
      (key) => preferences[key]
    );

    if (selectedChannels.length === 0) {
      return toast.error("Please select at least one notification channel");
    }

    try {
      setStep(2);

      // 3. Updated Payload to include quietHours
      const response = await axios.post(
        "https://notifyhub-backend-gral.onrender.com/api/users/create-app",
        {
          name: projectName,
          channel: selectedChannels.map((c) => c.toLowerCase()),
          quietHours: quietHours, // Sending the object: {enabled, start, end}
        },
        { withCredentials: true }
      );

      toast.success("Project created successfully.");
      setGeneratedKey(response.data.app.apiKey);
      setStep(3);
    } catch (error) {
      setStep(1);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard!");
  };

  return (
    <div
      className={`pt-24 pb-20 transition-colors duration-300 min-h-screen flex items-center ${
        isDarkMode
          ? "bg-slate-950 text-slate-300"
          : "bg-slate-50 text-slate-600"
      }`}
    >
      {/* STEP 1: CONFIGURATION FORM */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-in fade-in duration-500">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/20">
              <Rocket size={32} />
            </div>
            <h1
              className={`text-4xl font-black tracking-tight mb-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Launch a New Project
            </h1>
            <p className="text-lg opacity-70">
              Define your workspace and select your notification channels.
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Name Input */}
            <div
              className={`p-8 rounded-3xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <label className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4 block">
                Step 1: Project Identity
              </label>
              <input
                type="text"
                placeholder="e.g. My Production API"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`w-full p-4 rounded-2xl border text-lg font-semibold outline-none transition-all focus:ring-4 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/10"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/5"
                }`}
              />
            </div>

            {/* Channel Toggles */}
            <div
              className={`p-8 rounded-3xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <label className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-6 block">
                Step 2: Notification Channels
              </label>
              <div className="grid grid-cols-1 gap-4">
                <PreferenceToggle
                  icon={<Mail size={22} />}
                  title="Email"
                  active={preferences.email}
                  onClick={() => handleToggle("email")}
                  isDarkMode={isDarkMode}
                />
                <PreferenceToggle
                  icon={<Smartphone size={22} />}
                  title="In-App"
                  active={preferences.inApp}
                  onClick={() => handleToggle("inApp")}
                  isDarkMode={isDarkMode}
                />
                <PreferenceToggle
                  icon={<MessageSquare size={22} />}
                  title="SMS"
                  active={preferences.sms}
                  onClick={() => handleToggle("sms")}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            <div className={`p-8 rounded-3xl border transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-blue-500 block">
                  Step 3: Quiet Hours (Optional)
                </label>
                <button
                  onClick={handleQuietHoursToggle}
                  className={`w-12 h-6 rounded-full relative transition-all ${quietHours.enabled ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${quietHours.enabled ? "left-7" : "left-1"}`} />
                </button>
              </div>

              <div className={`flex items-center gap-4 mb-6 ${!quietHours.enabled && "opacity-40"}`}>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <Moon size={22} />
                </div>
                <div>
                  <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Do Not Disturb</p>
                  <p className="text-sm opacity-60">Mute notifications during a specific window</p>
                </div>
              </div>

              {quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                  <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <label className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1">
                      <Clock size={10} /> Start
                    </label>
                    <input
                      type="time"
                      value={quietHours.start}
                      onChange={(e) => setQuietHours(prev => ({...prev, start: e.target.value}))}
                      className="bg-transparent font-bold outline-none"
                    />
                  </div>
                  <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <label className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1">
                      <Clock size={10} /> End
                    </label>
                    <input
                      type="time"
                      value={quietHours.end}
                      onChange={(e) => setQuietHours(prev => ({...prev, end: e.target.value}))}
                      className="bg-transparent font-bold outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreate}
              className="w-full group flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black rounded-3xl shadow-2xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              Deploy & Generate Key
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REUSABLE LOADER */}
      {step === 2 && (
        <Loader
          title="Provisioning Infrastructure..."
          subtext="Setting up your secure notification endpoints."
          isDarkMode={isDarkMode}
        />
      )}

      {/* STEP 3: SUCCESS & API KEY DISPLAY */}
      {step === 3 && (
        <ApiKeyDisplay
          generatedKey={generatedKey}
          projectName={projectName}
          isDarkMode={isDarkMode}
          onCopy={copyToClipboard}
          onDashboardRedirect={() => navigate("/dashboard/projects")}
        />
      )}
    </div>
  );
};

// Internal Toggle Component
const PreferenceToggle = ({ icon, title, active, onClick, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-5 p-5 rounded-2xl border text-left transition-all ${
      active
        ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
        : isDarkMode
        ? "bg-slate-800 border-slate-700 hover:border-slate-600"
        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
    }`}
  >
    <div
      className={`p-3 rounded-xl transition-colors ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : isDarkMode
          ? "bg-slate-700 text-slate-400"
          : "bg-slate-50 text-slate-400 border border-slate-100"
      }`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </p>
    </div>
    <div
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
        active
          ? "bg-blue-600 border-blue-600"
          : isDarkMode
          ? "border-slate-600"
          : "border-slate-300"
      }`}
    >
      {active && <Check size={16} className="text-white" />}
    </div>
  </button>
);

export default CreateProjectPage;
