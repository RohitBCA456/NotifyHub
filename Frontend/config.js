const isProduction = import.meta.env.VITE_NODE_ENV === "production";

export const config = {
  isProduction,
  services: {
    backendService: isProduction 
      ? import.meta.env.VITE_BACKEND_URL 
      : "http://localhost:3000"
  },
  socials: {
    twitter: import.meta.env.VITE_TWITTER_URL || "#",
    github: import.meta.env.VITE_GITHUB_URL || "#",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "#"
  }
};