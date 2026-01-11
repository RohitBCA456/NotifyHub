import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const AnalyticsChart = ({ isDarkMode }) => {
  const [hoveredData, setHoveredData] = useState(null);

  // Hardcoded volume data (0-100 range for height %)
  const volumeData = [45, 52, 38, 65, 48, 80, 70, 90, 55, 60, 75, 88];
  
  const channels = [
    { label: "Email", value: 65, strokeDash: "65 100", offset: "0", color: "#3b82f6", bg: "bg-blue-500" },
    { label: "In-App", value: 25, strokeDash: "25 100", offset: "-65", color: "#6366f1", bg: "bg-indigo-500" },
    { label: "SMS", value: 10, strokeDash: "10 100", offset: "-90", color: "#ec4899", bg: "bg-pink-500" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 1. Bar Chart: Delivery Volume */}
      <div className={`lg:col-span-8 p-8 rounded-3xl border transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <h3 className={`text-lg font-bold mb-10 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          <BarChart3 size={20} className="text-blue-500" /> Delivery Volume (24h)
        </h3>
        
        {/* Container with explicit height */}
        <div className="flex items-end justify-between h-64 gap-2 px-2 border-b border-slate-500/10">
          {volumeData.map((val, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group">
              {/* THE BAR: Added min-height and explicit bg color */}
              <div 
                className="w-full max-w-[32px] bg-blue-600/40 group-hover:bg-blue-600 transition-all rounded-t-md relative cursor-help" 
                style={{ height: `${val}%` }} 
              >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50">
                  {val * 120} requests
                </div>
              </div>
              {/* Label below bar */}
              <span className="text-[10px] font-bold opacity-30 mt-2">H{i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Pie Chart: Channel Mix */}
      <div className={`lg:col-span-4 p-8 rounded-3xl border transition-colors ${
        isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <h3 className={`text-lg font-bold mb-8 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          <PieChartIcon size={20} className="text-indigo-500" /> Channel Mix
        </h3>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 rounded-full">
            {channels.map((chan) => (
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
                style={{ pointerEvents: 'stroke' }}
                className="cursor-pointer hover:opacity-80 transition-all"
                onMouseEnter={() => setHoveredData({ label: chan.label, value: chan.value })}
                onMouseLeave={() => setHoveredData(null)}
              />
            ))}
            <circle r="12" cx="16" cy="16" fill={isDarkMode ? "#020617" : "#ffffff"} className="pointer-events-none" />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredData ? (
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">{hoveredData.label}</p>
                <p className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{hoveredData.value}%</p>
              </div>
            ) : (
              <div className="text-center">
                <p className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Channels</p>
                <p className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">Hover Slices</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {channels.map((ch) => (
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