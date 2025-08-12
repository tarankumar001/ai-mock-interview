import type { User as AppUser } from "@/types";
import { db } from "@/config/firebase.config";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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
        console.log("Checking Firestore for user:", user.id);
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const userData: AppUser = {
            id: user.id,
            name: user.fullName || user.firstName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "N/A",
            imageUrl: user.imageUrl,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
          };

          await setDoc(userRef, userData);
          console.log("User created in Firestore");
        } else {
          await updateDoc(userRef, {
            updatedAt: serverTimestamp(),
          });
          console.log("User last login updated");
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
