// FIX: Redefined the User interface to be a plain data object instead of extending the complex FirebaseUser type.
// This correctly represents the user data structure used throughout the app and resolves the type error.
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  robloxId?: string;
  bio?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
}
