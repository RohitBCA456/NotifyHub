import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, MoreVertical, Webhook, Activity, AlertCircle, Key, Trash2 } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from 'react-router-dom';
import ViewApiKey from './ViewApiKey';
import Loader from "../components/Loader";

const HeroSectionProjects = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // State for Modal
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const projects = [
    { id: 1, name: "Production API", status: "Active", requests: "12,402", lastActive: "2 mins ago" },
    { id: 2, name: "Staging Webhook", status: "Active", requests: "1,050", lastActive: "1 hour ago" },
    { id: 3, name: "Legacy Integration", status: "Inactive", requests: "0", lastActive: "3 days ago" },
    { id: 4, name: "Payment Gateway Hub", status: "Error", requests: "8,900", lastActive: "Just now" },
    { id: 5, name: "Customer Portal Sync", status: "Active", requests: "4,200", lastActive: "15 mins ago" },
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionNavigation = (path) => {
    setIsRedirecting(true);
    setTimeout(() => {
      navigate(path);
    }, 600); 
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleViewKey = (e, project) => {
    e.stopPropagation(); // Prevent navigation to viewProject
    setSelectedProject(project);
    setIsKeyModalOpen(true);
    setOpenMenuId(null); // Close the dropdown
  };

  if (isRedirecting) {
    return (
      <Loader 
        title="Opening Workspace..." 
        subtext="Fetching project details and analytics" 
        isDarkMode={isDarkMode} 
        fullScreen={true} 
      />
    );
  }

  return (
    <div className={`pt-24 pb-12 transition-colors duration-300 min-h-screen ${
      isDarkMode ? "bg-slate-950" : "bg-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className={`text-4xl font-black tracking-tight mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Your Projects
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Managing {projects.length} Webhook end-points across your workspace.
            </p>
          </div>

          <button 
            onClick={() => navigate("/createProject")}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 group shrink-0"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Create New Project
          </button>
        </div>

        {/* Search Bar */}
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
                onClick={() => handleActionNavigation("/viewProject")}
                className={`group p-6 rounded-3xl border transition-all hover:-translate-y-1 cursor-pointer relative ${
                  isDarkMode 
                    ? "bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900" 
                    : "bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-blue-50"}`}>
                    <Webhook size={20} className="text-blue-500" />
                  </div>
                  
                  <div className="relative" ref={openMenuId === project.id ? menuRef : null}>
                    <button 
                      onClick={(e) => toggleMenu(e, project.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDarkMode ? "text-slate-500 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === project.id && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 ${
                        isDarkMode ? "bg-slate-900 border-slate-800 shadow-black" : "bg-white border-slate-200 shadow-slate-200"
                      }`}>
                        <button 
                          onClick={(e) => handleViewKey(e, project)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Key size={16} className="text-blue-500" />
                          View API Key
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); console.log("Delete Project"); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-red-500 ${
                            isDarkMode ? "hover:bg-red-500/10" : "hover:bg-red-50"
                          }`}
                        >
                          <Trash2 size={16} />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>
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

      {/* Modal Component Hooked Up */}
      <ViewApiKey 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
        projectName={selectedProject?.name} 
      />
    </div>
  );
};

export default HeroSectionProjects;