
export interface UserMission {
  id: number;
  user_id: string;
  mission_text: string;
  xp: number;
  status: string; // Changed from 'pending' | 'completed' to string to match database
  mission_type: string;
  completed_on: string | null;
  created_at: string;
}

export interface Mentor {
  id: number;
  name: string;
  college: string;
  specialization: string;
  bio: string;
  profile_image: string | null;
  rating: number;
  sessions_completed: number;
}

export interface MentorSession {
  id: number;
  user_id: string;
  mentor_id: number;
  scheduled_date: string;
  status: string; // Changed from specific union type to string to match database
  created_at: string;
  mentors: Mentor;
}

export interface College {
  id: number;
  name: string;
  location: string;
  stream: string;
  state: string;
  rating: number;
  budget_range: string;
  budget_value: number;
  image_url: string | null;
  apply_link: string;
}

export interface RecentlyViewedCollege {
  id: number;
  user_id: string;
  college_id: number;
  viewed_at: string;
  colleges: College;
}

export interface Scholarship {
  id: number;
  name: string;
  category: string;
  eligibility: string;
  amount: string;
  description: string | null;
  last_date: string;
  link: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  gender?: string;
  age?: number;
  phone?: string;
  education_background?: string;
  percentage?: number;
  stream?: string;
  preferred_states?: string[];
  xp: number;
  level: number;
  created_at: string;
}
