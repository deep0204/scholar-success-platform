
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, getUserProfile, signIn, signOut } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser } from '@supabase/supabase-js';

type User = {
  id: string;
  email?: string; // Making email optional to match Supabase User type
  full_name?: string;
  gender?: string;
  age?: number;
  phone?: string;
  education_background?: string;
  percentage?: number;
  stream?: string;
  preferred_states?: string[];
  xp?: number;
  level?: number;
} | null;

type AuthContextType = {
  user: User;
  profile: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, error?: any}>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing auth session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser as User);
          
          // Fetch user profile
          const { profile: userProfile } = await getUserProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        return { success: false, error };
      }
      
      if (data.user) {
        setUser(data.user as User);
        
        // Fetch user profile
        const { profile: userProfile } = await getUserProfile(data.user.id);
        setProfile(userProfile);
        
        return { success: true };
      }
      
      return { success: false, error: new Error('Login failed') };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
