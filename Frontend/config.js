const isProduction = process.env.NODE_ENV === "production";

export const config = {
  isProduction,
  services: {
    backendService: isProduction 
      ? process.env.BACKEND_URL 
      : "http://localhost:3000"
  },
  socials: {
    twitter: import.meta.env.VITE_TWITTER_URL || "#",
    github: import.meta.env.VITE_GITHUB_URL || "#",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "#"
  }
};