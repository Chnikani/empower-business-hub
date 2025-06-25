
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
