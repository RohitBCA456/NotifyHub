import React from "react";
import { Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleSocialLogin = (provider) => {
    // Logic for Firebase, Supabase, or NextAuth would go here
    console.log(`Logging in with ${provider}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to NotifyHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to manage your notifications
          </p>
        </div>

        {/* Social Buttons Container */}
        <div className="mt-8 space-y-4">
          {/* Google Sign-in */}
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5 mr-3"
            />
            Continue with Google
          </button>

          {/* GitHub Sign-in */}
          <button
            onClick={() => handleSocialLogin("github")}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm bg-[#24292F] text-sm font-medium text-white hover:bg-[#1a1f24] transition-colors duration-200"
          >
            <Github className="h-5 w-5 mr-3" />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email Login (Optional/Placeholder) */}
        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-500 ml-1"
          >
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
