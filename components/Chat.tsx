import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { signOut, db, collection, query, getDocs, doc, updateDoc, getDoc } from '../services/firebase';

// --- Reusable Components ---
const VerifiedBadge: React.FC<{ user: User }> = ({ user }) => {
  if (user.isAdmin) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  }
  if (user.isVerified) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 12a1 1 0 112 0 1 1 0 01-2 0zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path>
      </svg>
    );
  }
  return null;
};

const Header: React.FC<{ user: User; onSearch: (term: string) => void }> = ({ user, onSearch }) => (
    <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-md">
    <div className="text-xl font-bold text-cyan-400">Roblox Friends Hub</div>
    <div className="flex-1 max-w-md mx-4">
        <input 
            type="text" 
            placeholder="Search users..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
    </div>
    <div className="flex items-center gap-4">
        <img src={user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
        <button 
          onClick={signOut}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Sign Out
        </button>
    </div>
  </header>
);

// --- Main Page Component ---
interface HomePageProps {
  currentUser: User;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    setUsers(userList);
    setFilteredUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredUsers(users);
      return;
    }
    const lowercasedTerm = term.toLowerCase();
    const results = users.filter(user => 
      user.displayName?.toLowerCase().includes(lowercasedTerm) ||
      user.email?.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredUsers(results);
  };
  
  const toggleVerification = async (userToUpdate: User) => {
    if (!currentUser.isAdmin) return;
    const userRef = doc(db, 'users', userToUpdate.uid);
    try {
        await updateDoc(userRef, {
            isVerified: !userToUpdate.isVerified
        });
        // Refresh user list to show updated status
        fetchUsers();
    } catch (error) {
        console.error("Error updating verification status:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <Header user={currentUser} onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">Hub Members</h2>
            
            {/* Admin Panel */}
            {currentUser.isAdmin && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Admin Panel - User Verification</h3>
                    <div className="space-y-2">
                        {users.map(user => (
                            <div key={user.uid} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-700">
                                <div className="flex items-center gap-3">
                                  <img src={user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`} alt="" className="w-8 h-8 rounded-full"/>
                                  <span>{user.displayName || user.email}</span>
                                  <VerifiedBadge user={user} />
                                </div>
                                <button
                                    onClick={() => toggleVerification(user)}
                                    className={`px-3 py-1 text-sm rounded-md ${user.isVerified ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                >
                                    {user.isVerified ? 'Unverify' : 'Verify'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Loading users...</p>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.uid} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4">
                     <img src={user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`} alt={user.displayName || 'User'} className="w-12 h-12 rounded-full" />
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-slate-200">{user.displayName || 'No Name'}</p>
                           <VerifiedBadge user={user} />
                        </div>
                        <p className="text-sm text-slate-400">{user.robloxId || 'No Roblox ID'}</p>
                     </div>
                  </div>
                ))
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;