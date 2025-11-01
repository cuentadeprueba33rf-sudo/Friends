import React from 'react';
import useAuth from './hooks/useAuth';
import AuthPage from './components/Login';
import HomePage from './components/Chat';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-screen font-sans">
      {user ? <HomePage currentUser={user} /> : <AuthPage />}
    </div>
  );
};

export default App;
