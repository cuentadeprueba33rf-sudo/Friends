import React, { useState, FormEvent } from 'react';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  createUserProfileDocument,
  updateProfile
} from '../services/firebase';

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

        <p className="text-sm text-slate-400 mt-8">
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