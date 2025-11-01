import { initializeApp, type FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signOut as signOutFirebase, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type Auth,
  type User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  getDoc,
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  type Firestore,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvn_4ZBReZ2G-AGan_dtoqZrJOOHTpjC0",
  authDomain: "sam-codesa.firebaseapp.com",
  databaseURL: "https://sam-codesa-default-rtdb.firebaseio.com",
  projectId: "sam-codesa",
  storageBucket: "sam-codesa.appspot.com",
  messagingSenderId: "181601600923",
  appId: "1:181601600923:web:ec40382d5e8264f7918d3e",
  measurementId: "G-Z90YD3LRPB"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export const createUserProfileDocument = async (userAuth: FirebaseUser, additionalData?: object) => {
  if (!userAuth) return;

  const userRef = doc(db, `users/${userAuth.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = serverTimestamp();
    const isAdmin = email === 'helpsamia@gmail.com';
    const isVerified = isAdmin; // Admin is verified by default

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        isAdmin,
        isVerified,
        robloxId: '',
        bio: '',
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user profile", error);
    }
  }
  return userRef;
};

export const signOut = (): Promise<void> => {
  return signOutFirebase(auth);
};

export const fetchUserProfile = async (userId: string) => {
    const userRef = doc(db, `users/${userId}`);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return null;
}

export { 
    auth, 
    db, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    getDoc
};