import React, { useState, FormEvent } from 'react';
import { 
  signInWithGoogle, 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  createUserProfileDocument,
  updateProfile
} from '../services/firebase';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#FBBC05" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        setError(err.message);
      }
    } else {
       if (!displayName.trim()) {
        setError("Display name is required.");
        return;
      }
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        await createUserProfileDocument(user, { displayName });
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-full bg-slate-900 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-400 mb-6">
          {isLogin ? 'Sign in to the Roblox Friends Hub' : 'Join the Hub today'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
             <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              required
              className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
           {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-cyan-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-500">OR</span>
            </div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full inline-flex items-center justify-center bg-slate-700 text-slate-200 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-sm text-slate-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-cyan-400 hover:text-cyan-300 ml-1">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  );
};

export default AuthPage;