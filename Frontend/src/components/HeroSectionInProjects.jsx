import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Webhook, Activity, AlertCircle } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

const HeroSectionProjects = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Hardcoded Projects Data focused on Webhooks
  const projects = [
    { id: 1, name: "Production API", status: "Active", requests: "12,402", lastActive: "2 mins ago" },
    { id: 2, name: "Staging Webhook", status: "Active", requests: "1,050", lastActive: "1 hour ago" },
    { id: 3, name: "Legacy Integration", status: "Inactive", requests: "0", lastActive: "3 days ago" },
    { id: 4, name: "Payment Gateway Hub", status: "Error", requests: "8,900", lastActive: "Just now" },
    { id: 5, name: "Customer Portal Sync", status: "Active", requests: "4,200", lastActive: "15 mins ago" },
  ];

  // Logic to filter projects based on search input
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`pt-24 pb-12 transition-colors duration-300 min-h-screen ${
      isDarkMode ? "bg-slate-950" : "bg-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className={`text-4xl font-black tracking-tight mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}>
              Your Projects
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Managing {projects.length} Webhook end-points across your workspace.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 group shrink-0">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Create New Project
          </button>
        </div>

        {/* Search Bar (Centered and Full Width) */}
        <div className="relative w-full mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-md shadow-slate-200/50"
            }`}
          />
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={`group p-6 rounded-3xl border transition-all hover:-translate-y-1 cursor-pointer ${
                  isDarkMode 
                    ? "bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900" 
                    : "bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-blue-50"}`}>
                    <Webhook size={20} className="text-blue-500" />
                  </div>
                  <button className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? "text-slate-500 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
                  }`}>
                    <MoreVertical size={20} />
                  </button>
                </div>

                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {project.name}
                </h3>
                <p className={`text-xs flex items-center gap-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  <Activity size={14} /> Last active: {project.lastActive}
                </p>

                <div className={`h-[1px] w-full my-6 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}></div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                      Status
                    </span>
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${
                      project.status === 'Error' ? 'text-red-500' : project.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                      {project.status === 'Error' && <AlertCircle size={14} />}
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                      Requests
                    </span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {project.requests}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className={`text-lg ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              No projects match your search query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default HeroSectionProjects;