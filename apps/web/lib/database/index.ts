export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          avatar_url: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      destinations: {
        Row: {
          id: string;
          type: 'continent' | 'country' | 'city';
          parent_id: string | null;
          slug: string;
          slug_path: string;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          sort_order: number;
          lat: number | null;
          lng: number | null;
          hero_media_id: string | null;
          cover_media_id: string | null;
          video_url: string | null;
          map_embed: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['destinations']['Row']> & {
          type: 'continent' | 'country' | 'city';
          slug: string;
          slug_path: string;
        };
        Update: Partial<Database['public']['Tables']['destinations']['Row']>;
      };
      enquiries: {
        Row: {
          id: string;
          destination_id: string | null;
          itinerary_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          travel_date: string | null;
          budget: string | null;
          adults: number;
          children: number;
          travel_style: string | null;
          notes: string | null;
          status: string;
          assigned_to: string | null;
          locale: string;
          utm: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['enquiries']['Row']> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database['public']['Tables']['enquiries']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_permission: {
        Args: { p_resource: string; p_action: string };
        Returns: boolean;
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role:
        | 'super_admin'
        | 'admin'
        | 'editor'
        | 'content_writer'
        | 'marketing';
      content_status: 'draft' | 'published' | 'archived';
      destination_type: 'continent' | 'country' | 'city';
      enquiry_status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
