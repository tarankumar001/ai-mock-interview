import type { User as AppUser } from "@/types";
import { db } from "@/config/firebase.config";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LoaderPage } from "@/views/loader-page";

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (!isSignedIn || !user) return;

      setLoading(true);
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // New user → set both createdAt and updatedAt
          const userData: AppUser = {
            id: user.id,
            name: user.fullName || user.firstName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "N/A",
            imageUrl: user.imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, userData);
        } else {
          // Existing user → only update updatedAt
          await setDoc(
            userRef,
            { updatedAt: serverTimestamp() },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Error storing the user data:", error);
      } finally {
        setLoading(false);
      }
    };

    storeUserData();
  }, [isSignedIn, user]);

  if (loading) return <LoaderPage />;
  return null;
};

export default AuthHandler;
