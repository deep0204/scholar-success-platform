import { createClient } from '@supabase/supabase-js';

// Use the direct URLs instead of environment variables
const supabaseUrl = "https://ouypqcymrckqhqpnjhqq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eXBxY3ltcmNrcWhxcG5qaHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTkyMzMsImV4cCI6MjA2MDQ5NTIzM30.mpjet2eZIIJyVImEbAE1yVcpNFyQ3YCU7OK8FdbBNKI";

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

// Mentors related functions - improved to include more error handling
export const getMentors = async () => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*');
    
    if (error) {
      console.error("Error fetching mentors:", error.message);
      throw error;
    }
    
    return { mentors: data || [], error: null };
  } catch (err) {
    console.error("Exception in getMentors:", err);
    return { mentors: [], error: err };
  }
};

export const bookMentorSession = async (userId: string, mentorId: number, scheduledDate: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        mentor_id: mentorId,
        scheduled_date: scheduledDate,
        status: 'confirmed',
      });
    
    if (error) {
      console.error("Error booking mentor session:", error.message);
      throw error;
    }
    
    // Add XP for booking a mentor session
    await updateUserXP(userId, 15);
    
    return { data, error: null };
  } catch (err) {
    console.error("Exception in bookMentorSession:", err);
    return { data: null, error: err };
  }
};

export const getUserSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentors(*)')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching user sessions:", error.message);
      throw error;
    }
    
    return { sessions: data || [], error: null };
  } catch (err) {
    console.error("Exception in getUserSessions:", err);
    return { sessions: [], error: err };
  }
};

// Weekly missions related functions - improved for better error handling
export const getUserMissions = async (userId: string) => {
  try {
    // First check if the user has any missions assigned
    const { data: existingMissions, error: checkError } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId);
    
    if (checkError) {
      console.error("Error checking user missions:", checkError.message);
      throw checkError;
    }
    
    // If the user doesn't have any missions assigned, create default missions
    if (!existingMissions || existingMissions.length === 0) {
      // Get default missions from the missions table
      const { data: defaultMissions, error: defaultError } = await supabase
        .from('missions')
        .select('*')
        .eq('is_default', true);
      
      if (defaultError) {
        console.error("Error fetching default missions:", defaultError.message);
        throw defaultError;
      }
      
      // Create user missions from default missions
      if (defaultMissions && defaultMissions.length > 0) {
        const userMissionsToInsert = defaultMissions.map(mission => ({
          user_id: userId,
          mission_text: mission.mission_text,
          xp: mission.xp,
          status: 'pending',
          mission_type: mission.mission_type,
        }));
        
        const { error: insertError } = await supabase
          .from('user_missions')
          .insert(userMissionsToInsert);
        
        if (insertError) {
          console.error("Error creating user missions:", insertError.message);
          throw insertError;
        }
        
        // Fetch the newly created missions
        const { data: newMissions, error: fetchError } = await supabase
          .from('user_missions')
          .select('*')
          .eq('user_id', userId);
        
        if (fetchError) {
          console.error("Error fetching new missions:", fetchError.message);
          throw fetchError;
        }
        
        return { missions: newMissions || [], error: null };
      }
    }
    
    // Return existing missions
    return { missions: existingMissions || [], error: null };
  } catch (err) {
    console.error("Exception in getUserMissions:", err);
    return { missions: [], error: err };
  }
};

export const updateMissionStatus = async (missionId: number, userId: string, completed: boolean) => {
  try {
    // Find the mission to get XP value
    const { data: missionData, error: missionError } = await supabase
      .from('user_missions')
      .select('xp')
      .eq('id', missionId)
      .single();
      
    if (missionError) {
      console.error("Error fetching mission data:", missionError.message);
      throw missionError;
    }
    
    const xpChange = completed ? (missionData?.xp || 0) : -(missionData?.xp || 0);
    
    // Update mission status
    const { data, error } = await supabase
      .from('user_missions')
      .update({
        status: completed ? 'completed' : 'pending',
        completed_on: completed ? new Date().toISOString() : null,
      })
      .eq('id', missionId);
    
    if (error) {
      console.error("Error updating mission status:", error.message);
      throw error;
    }
    
    // Update user XP
    const xpResult = await updateUserXP(userId, xpChange);
    
    if (xpResult.error) {
      console.error("Error updating user XP:", xpResult.error);
    }
    
    return { data, error: null, xpChange, xpResult };
  } catch (err) {
    console.error("Exception in updateMissionStatus:", err);
    return { data: null, error: err, xpChange: 0, xpResult: { error: err } };
  }
};

// Function to create sample data (colleges, mentors, missions)
export const createSampleData = async () => {
  try {
    // Check if mentors exist
    const { data: existingMentors } = await supabase
      .from('mentors')
      .select('id')
      .limit(1);
    
    // If no mentors, create sample mentors
    if (!existingMentors || existingMentors.length === 0) {
      await supabase.from('mentors').insert([
        {
          name: "Dr. Priya Sharma",
          college: "IIT Delhi",
          specialization: "Computer Science",
          bio: "Experienced professor with 10+ years in AI and machine learning research.",
          profile_image: "https://randomuser.me/api/portraits/women/45.jpg",
          rating: 4.9,
          sessions_completed: 125
        },
        {
          name: "Prof. Rajesh Kumar",
          college: "IIM Ahmedabad",
          specialization: "Business Management",
          bio: "MBA mentor specializing in entrepreneurship and business strategy.",
          profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
          rating: 4.8,
          sessions_completed: 98
        },
        {
          name: "Dr. Ananya Gupta",
          college: "AIIMS Delhi",
          specialization: "Medical Sciences",
          bio: "Medical professional with expertise in guiding aspiring doctors.",
          profile_image: "https://randomuser.me/api/portraits/women/33.jpg",
          rating: 4.7,
          sessions_completed: 87
        },
        {
          name: "Prof. Vikram Singh",
          college: "NIT Trichy",
          specialization: "Mechanical Engineering",
          bio: "Engineering educator with industry experience in automotive design.",
          profile_image: "https://randomuser.me/api/portraits/men/52.jpg",
          rating: 4.6,
          sessions_completed: 76
        }
      ]);
    }
    
    // Check if colleges exist
    const { data: existingColleges } = await supabase
      .from('colleges')
      .select('id')
      .limit(1);
    
    // If no colleges, create sample colleges
    if (!existingColleges || existingColleges.length === 0) {
      await supabase.from('colleges').insert([
        {
          name: "Indian Institute of Technology, Delhi",
          location: "New Delhi, Delhi",
          stream: "Engineering",
          state: "Delhi",
          rating: 4.9,
          budget_range: "₹8-10 Lakh per annum",
          budget_value: 800000,
          image_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://home.iitd.ac.in/"
        },
        {
          name: "Indian Institute of Management, Ahmedabad",
          location: "Ahmedabad, Gujarat",
          stream: "Business",
          state: "Gujarat",
          rating: 4.9,
          budget_range: "₹15-20 Lakh per annum",
          budget_value: 1500000,
          image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://www.iima.ac.in/"
        },
        {
          name: "All India Institute of Medical Sciences",
          location: "New Delhi, Delhi",
          stream: "Medical",
          state: "Delhi",
          rating: 4.8,
          budget_range: "₹6-8 Lakh per annum",
          budget_value: 600000,
          image_url: "https://images.unsplash.com/photo-1581362653986-365be3f986c8?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://www.aiims.edu/"
        },
        {
          name: "St. Stephen's College",
          location: "Delhi University, Delhi",
          stream: "Arts & Science",
          state: "Delhi",
          rating: 4.7,
          budget_range: "₹2-4 Lakh per annum",
          budget_value: 200000,
          image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://www.ststephens.edu/"
        },
        {
          name: "National Institute of Technology, Trichy",
          location: "Tiruchirappalli, Tamil Nadu",
          stream: "Engineering",
          state: "Tamil Nadu",
          rating: 4.6,
          budget_range: "₹5-7 Lakh per annum",
          budget_value: 500000,
          image_url: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://www.nitt.edu/"
        },
        {
          name: "Birla Institute of Technology and Science, Pilani",
          location: "Pilani, Rajasthan",
          stream: "Engineering",
          state: "Rajasthan",
          rating: 4.7,
          budget_range: "₹10-12 Lakh per annum",
          budget_value: 1000000,
          image_url: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1000&auto=format&fit=crop",
          apply_link: "https://www.bits-pilani.ac.in/"
        }
      ]);
    }
    
    // Check if default missions exist
    const { data: existingMissions } = await supabase
      .from('missions')
      .select('id')
      .limit(1);
    
    // If no missions, create sample missions
    if (!existingMissions || existingMissions.length === 0) {
      await supabase.from('missions').insert([
        {
          mission_text: "Complete your profile information",
          xp: 20,
          is_default: true,
          mission_type: "onboarding"
        },
        {
          mission_text: "Explore at least 3 colleges",
          xp: 15,
          is_default: true,
          mission_type: "engagement"
        },
        {
          mission_text: "Book a session with a mentor",
          xp: 25,
          is_default: true,
          mission_type: "engagement"
        },
        {
          mission_text: "Watch an educational video",
          xp: 10,
          is_default: true,
          mission_type: "educational"
        },
        {
          mission_text: "Apply for a scholarship",
          xp: 30,
          is_default: true,
          mission_type: "progress"
        }
      ]);
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creating sample data:", err);
    return { success: false, error: err };
  }
};

// Leaderboard related functions - improved error handling
export const getLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, xp, level')
      .order('xp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching leaderboard:", error.message);
      throw error;
    }
    
    return { users: data || [], error: null };
  } catch (err) {
    console.error("Exception in getLeaderboard:", err);
    return { users: [], error: err };
  }
};

// Create initial data - helper function for recently viewed colleges
export const viewCollege = async (userId: string, collegeId: number) => {
  try {
    // Add to recently viewed colleges
    const { data, error } = await supabase
      .from('recently_viewed_colleges')
      .insert({
        user_id: userId,
        college_id: collegeId,
        viewed_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error("Error adding to recently viewed colleges:", error.message);
      throw error;
    }
    
    // Add XP for viewing a college
    await updateUserXP(userId, 5);
    
    return { data, error: null };
  } catch (err) {
    console.error("Exception in viewCollege:", err);
    return { data: null, error: err };
  }
};

export const getRecentlyViewedColleges = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('recently_viewed_colleges')
      .select('*, colleges(*)')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching recently viewed colleges:", error.message);
      throw error;
    }
    
    return { recentColleges: data || [], error: null };
  } catch (err) {
    console.error("Exception in getRecentlyViewedColleges:", err);
    return { recentColleges: [], error: err };
  }
};
