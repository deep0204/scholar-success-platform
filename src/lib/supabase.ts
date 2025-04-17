
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUp = async (email: string, password: string, userData: any) => {
  // Register the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) return { data: null, error: authError };
  
  // If registration successful, add user data to the users table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: userData.full_name,
        gender: userData.gender,
        age: userData.age,
        phone: userData.phone,
        education_background: userData.education_background,
        percentage: userData.percentage,
        stream: userData.stream,
        preferred_states: userData.preferred_states,
        xp: 0,
        level: 1,
      });
    
    if (profileError) return { data: null, error: profileError };
  }
  
  return { data: authData, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return { user: null, error };
  }
  
  return { user: data.session.user, error: null };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data, error };
};

// Function to update user XP
export const updateUserXP = async (userId: string, xpAmount: number) => {
  // First get current XP
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('xp, level')
    .eq('id', userId)
    .single();
  
  if (fetchError) return { data: null, error: fetchError };
  
  let currentXP = userData.xp || 0;
  let newXP = currentXP + xpAmount;
  let currentLevel = userData.level || 1;
  
  // Calculate new level (100 XP per level)
  let newLevel = Math.floor(newXP / 100) + 1;
  
  const { data, error } = await supabase
    .from('users')
    .update({
      xp: newXP,
      level: newLevel,
    })
    .eq('id', userId);
  
  const levelUp = newLevel > currentLevel;
  
  return { data, error, newXP, newLevel, levelUp };
};

// College related functions
export const getColleges = async (filters: any = {}) => {
  let query = supabase.from('colleges').select('*');
  
  // Apply filters if provided
  if (filters.stream) {
    query = query.eq('stream', filters.stream);
  }
  
  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  
  if (filters.rating && filters.rating > 0) {
    query = query.gte('rating', filters.rating);
  }
  
  if (filters.budget && filters.budget.length === 2) {
    query = query.gte('budget_value', filters.budget[0])
                  .lte('budget_value', filters.budget[1]);
  }
  
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query;
  return { colleges: data, error };
};

export const viewCollege = async (userId: string, collegeId: number) => {
  // Add to recently viewed colleges
  const { data, error } = await supabase
    .from('recently_viewed_colleges')
    .insert({
      user_id: userId,
      college_id: collegeId,
      viewed_at: new Date().toISOString(),
    });
  
  // Add XP for viewing a college
  await updateUserXP(userId, 5);
  
  return { data, error };
};

export const getRecentlyViewedColleges = async (userId: string) => {
  const { data, error } = await supabase
    .from('recently_viewed_colleges')
    .select('*, colleges(*)')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(5);
  
  return { recentColleges: data, error };
};

// Mentor related functions
export const getMentors = async () => {
  const { data, error } = await supabase
    .from('mentors')
    .select('*');
  
  return { mentors: data, error };
};

export const bookMentorSession = async (userId: string, mentorId: number, scheduledDate: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      mentor_id: mentorId,
      scheduled_date: scheduledDate,
      status: 'confirmed',
    });
  
  // Add XP for booking a mentor session
  await updateUserXP(userId, 15);
  
  return { data, error };
};

export const getUserSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, mentors(*)')
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true });
  
  return { sessions: data, error };
};

// Scholarship related functions
export const getScholarships = async () => {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*');
  
  return { scholarships: data, error };
};

// Weekly missions related functions
export const getUserMissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_missions')
    .select('*')
    .eq('user_id', userId);
  
  return { missions: data, error };
};

export const updateMissionStatus = async (missionId: number, userId: string, completed: boolean) => {
  // Find the mission to get XP value
  const { data: missionData } = await supabase
    .from('user_missions')
    .select('xp')
    .eq('id', missionId)
    .single();
    
  const xpChange = completed ? missionData.xp : -missionData.xp;
  
  // Update mission status
  const { data, error } = await supabase
    .from('user_missions')
    .update({
      status: completed ? 'completed' : 'pending',
      completed_on: completed ? new Date().toISOString() : null,
    })
    .eq('id', missionId);
  
  // Update user XP
  const xpResult = await updateUserXP(userId, xpChange);
  
  return { data, error, xpChange, xpResult };
};

// Leaderboard related functions
export const getLeaderboard = async (limit = 10) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, xp, level')
    .order('xp', { ascending: false })
    .limit(limit);
  
  return { users: data, error };
};
