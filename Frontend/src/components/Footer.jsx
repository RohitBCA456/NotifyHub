import React from "react";
import { Bell, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { config } from "../../config";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const socialIconClass = `transition-colors ${
    isDarkMode
      ? "text-slate-500 hover:text-white"
      : "text-slate-400 hover:text-blue-600"
  }`;

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-950 border-slate-800"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Branding and Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Bell size={18} className="text-white" />
              </div>
              <span
                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                Notify<span className="text-blue-600">Hub</span>
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              The central hub for all your project notifications. Streamline
              your workflow and never miss a beat.
            </p>

            {/* System Status Indicator */}
            <div
              className={`mt-6 flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border ${
                isDarkMode
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium">
                All systems operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3
              className={`font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Product
            </h3>
            <ul
              className={`space-y-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3
              className={`font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Resources
            </h3>
            <ul
              className={`space-y-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3
              className={`font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Newsletter
            </h3>
            <p
              className={`text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Stay updated with our latest features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all shrink-0">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Social & Copyright */}
        <div
          className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${
            isDarkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div
            className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            © 2026 NotifyHub. Built with{" "}
            <Heart size={14} className="text-red-500 fill-red-500" /> by your
            team.
          </div>

          <div className="flex gap-4">
            <a
              href={config.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className={socialIconClass}
            >
              <Twitter size={20} />
            </a>
            <a
              href={config.socials.github}
              target="_blank"
              rel="noreferrer"
              className={socialIconClass}
            >
              <Github size={20} />
            </a>
            <a
              href={config.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={socialIconClass}
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
