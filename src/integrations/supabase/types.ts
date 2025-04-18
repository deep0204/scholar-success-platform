export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      colleges: {
        Row: {
          apply_link: string
          budget_range: string
          budget_value: number
          id: number
          image_url: string | null
          location: string
          name: string
          rating: number
          state: string
          stream: string
        }
        Insert: {
          apply_link: string
          budget_range: string
          budget_value: number
          id?: number
          image_url?: string | null
          location: string
          name: string
          rating: number
          state: string
          stream: string
        }
        Update: {
          apply_link?: string
          budget_range?: string
          budget_value?: number
          id?: number
          image_url?: string | null
          location?: string
          name?: string
          rating?: number
          state?: string
          stream?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          bio: string
          college: string
          id: number
          name: string
          profile_image: string | null
          rating: number
          sessions_completed: number | null
          specialization: string
        }
        Insert: {
          bio: string
          college: string
          id?: number
          name: string
          profile_image?: string | null
          rating: number
          sessions_completed?: number | null
          specialization: string
        }
        Update: {
          bio?: string
          college?: string
          id?: number
          name?: string
          profile_image?: string | null
          rating?: number
          sessions_completed?: number | null
          specialization?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          id: number
          is_default: boolean | null
          mission_text: string
          mission_type: string
          xp: number
        }
        Insert: {
          id?: number
          is_default?: boolean | null
          mission_text: string
          mission_type: string
          xp: number
        }
        Update: {
          id?: number
          is_default?: boolean | null
          mission_text?: string
          mission_type?: string
          xp?: number
        }
        Relationships: []
      }
      recently_viewed_colleges: {
        Row: {
          college_id: number | null
          id: number
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          college_id?: number | null
          id?: number
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          college_id?: number | null
          id?: number
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_colleges_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount: string
          category: string
          description: string | null
          eligibility: string
          id: number
          last_date: string
          link: string
          name: string
        }
        Insert: {
          amount: string
          category: string
          description?: string | null
          eligibility: string
          id?: number
          last_date: string
          link: string
          name: string
        }
        Update: {
          amount?: string
          category?: string
          description?: string | null
          eligibility?: string
          id?: number
          last_date?: string
          link?: string
          name?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          id: number
          mentor_id: number | null
          scheduled_date: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          mentor_id?: number | null
          scheduled_date: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          mentor_id?: number | null
          scheduled_date?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          completed_on: string | null
          created_at: string | null
          id: number
          mission_text: string
          mission_type: string
          status: string | null
          user_id: string
          xp: number
        }
        Insert: {
          completed_on?: string | null
          created_at?: string | null
          id?: number
          mission_text: string
          mission_type: string
          status?: string | null
          user_id: string
          xp: number
        }
        Update: {
          completed_on?: string | null
          created_at?: string | null
          id?: number
          mission_text?: string
          mission_type?: string
          status?: string | null
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number | null
          created_at: string | null
          education_background: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          level: number | null
          percentage: number | null
          phone: string | null
          preferred_states: string[] | null
          stream: string | null
          xp: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          education_background?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          level?: number | null
          percentage?: number | null
          phone?: string | null
          preferred_states?: string[] | null
          stream?: string | null
          xp?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          education_background?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          level?: number | null
          percentage?: number | null
          phone?: string | null
          preferred_states?: string[] | null
          stream?: string | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
