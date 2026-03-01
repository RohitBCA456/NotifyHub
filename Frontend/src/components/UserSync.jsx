import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../Store/userSlice.js";

const UserSync = () => {
  const { user } = useUser();
  const { sessionId, getToken } = useAuth();
  const dispatch = useDispatch();
  const hasSynced = useRef(false);

  // Ensure your UserSync useEffect looks like this:
  useEffect(() => {
    const syncUser = async () => {
      if (user && sessionId) {
        try {
          const token = await getToken();
          const userData = {
            username: user.username || user.fullName || "User",
            imageUrl: user.imageUrl,
            sessionId: sessionId,
            email: user.primaryEmailAddress?.emailAddress,
          };

          const userId = localStorage.getItem("userId");

          if (userId) {
            const cacheResponse = await fetch(
              "http://localhost:3000/api/users/cache-profile",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
              },
            );

            if (cacheResponse.ok) {
              console.log("Cache Hit");
              const data = await cacheResponse.json();

              if (data && data.user) {
                dispatch(setUser(data.user));
                console.log("Data dispatched to redux by cache");
                return;
              } else {
                console.error("Data not available");
              }
              hasSynced.current = true;
            }
          }

          const response = await fetch(
            "http://localhost:3000/api/users/save-credentials",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(userData),
            },
          );

          if (response.ok) {
            const data = await response.json();

            localStorage.setItem("userId", data?.user?._id);

            if (data && data.user) {
              dispatch(setUser(data.user));
              console.log("Redux updated with serializable data");
            } else {
              console.error(
                "Backend response ok, but 'user' object missing:",
                data,
              );
            }
            hasSynced.current = true;
            console.log("Synced to Backend and Redux");
          }
          console.log("User synced with backend");
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };

    syncUser();
  }, [user, sessionId, getToken]); // getToken added to dependencies

  return null; // This component doesn't render anything
};

export default UserSync;
