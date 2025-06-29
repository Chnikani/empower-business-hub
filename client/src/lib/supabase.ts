
// Supabase has been replaced with PostgreSQL + Drizzle
// This file is kept for legacy imports but will be removed

export const supabase = {
  // Legacy stub - no longer used
};

export type Database = {
  public: {
    Tables: {
      business_accounts: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      generated_images: {
        Row: {
          id: string
          business_id: string
          prompt: string
          style: string
          image_url: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          prompt: string
          style: string
          image_url: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          prompt?: string
          style?: string
          image_url?: string
          storage_path?: string
          created_at?: string
        }
      }
    }
  }
}
