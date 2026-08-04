export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Loose schema typing — CMS uses many tables; prefer runtime shape over strict codegen for now. */
export type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships: [];
      }
    >;
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
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
