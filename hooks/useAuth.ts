import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, fetchUserProfile } from '../services/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await fetchUserProfile(firebaseUser.uid);
          setUser({ ...firebaseUser, ...profile } as User);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile during auth state change:", error);
        // Still log the user in with basic info from firebaseUser,
        // but profile-specific data will be missing.
        if (firebaseUser) {
          setUser(firebaseUser as User); 
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;
