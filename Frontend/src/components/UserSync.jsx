import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../Store/userSlice.js";
import { config } from "../../config.js";

const BACKEND_API = config.services.backendService;

const UserSync = () => {
  const { user } = useUser();
  const { sessionId, getToken } = useAuth();
  const dispatch = useDispatch();
  const hasSynced = useRef(false);

  // Ensure your UserSync useEffect looks like this:
  useEffect(() => {
    const syncUser = async () => {
      if (user && sessionId && !hasSynced.current) {
        try {
          const token = await getToken();
          const userData = {
            username: user.username || user.fullName || "User",
            imageUrl: user.imageUrl,
            sessionId: sessionId,
            email: user.primaryEmailAddress?.emailAddress,
          };

          const userId = localStorage.getItem("userId");

          // --- STEP 1: CACHE CHECK ---
          if (userId) {
            const cacheRes = await fetch(
              `${BACKEND_API}/api/users/cache-profile`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
                credentials: "include",
              },
            );

            // Only parse if it's a 200 OK and IS JSON
            if (
              cacheRes.ok &&
              cacheRes.headers.get("content-type")?.includes("application/json")
            ) {
              const data = await cacheRes.json();
              if (data?.user) {
                dispatch(setUser(data.user));
                hasSynced.current = true;
                return; // EXIT: We have data, no need to call save-credentials
              }
            }
          }

          // --- STEP 2: DB SYNC (If cache missed or didn't exist) ---
          const response = await fetch(
            `${BACKEND_API}/api/users/save-credentials`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(userData),
              credentials: "include",
            },
          );

          if (!response.ok) {
            // This is where you catch the HTML error page instead of crashing
            const errorText = await response.text();
            console.error(
              `Backend Error (${response.status}):`,
              errorText.substring(0, 100),
            );
            return;
          }

          const data = await response.json();
          if (data?.user) {
            localStorage.setItem("userId", data.user._id);
            dispatch(setUser(data.user));
            hasSynced.current = true;
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };

    syncUser();
  }, [user, sessionId, getToken]);

  return null; 
};

export default UserSync;
