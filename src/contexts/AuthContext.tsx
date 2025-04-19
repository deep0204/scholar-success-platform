
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserProfile, signIn, signUp, signOut } from '@/lib/supabase';

interface AuthContextProps {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      
      setUser(currentUser);
      
      if (currentUser?.id) {
        const { profile: userProfile } = await getUserProfile(currentUser.id);
        setProfile(userProfile);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error("Sign In Error:", error.message);
      setLoading(false);
      return;
    }
    
    setUser(data.session?.user);
    
    if (data.session?.user?.id) {
      const { profile: userProfile } = await getUserProfile(data.session.user.id);
      setProfile(userProfile);
    }
    
    navigate('/dashboard');
    setLoading(false);
  };
  
  const handleSignUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    const { data, error } = await signUp(email, password, userData);
    
    if (error) {
      console.error("Sign Up Error:", error.message);
      setLoading(false);
      return;
    }
    
    setUser(data.user);
    
    if (data.user?.id) {
      const { profile: userProfile } = await getUserProfile(data.user.id);
      setProfile(userProfile);
    }
    
    navigate('/dashboard');
    setLoading(false);
  };
  
  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    
    if (error) {
      console.error("Sign Out Error:", error.message);
      setLoading(false);
      return;
    }
    
    setUser(null);
    setProfile(null);
    navigate('/login');
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const { profile: updatedProfile, error } = await getUserProfile(user.id);
      if (!error && updatedProfile) {
        setProfile(updatedProfile);
      }
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
