export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          category_id: number
          user_id: string
          title: string
          created_at: string
        }
        Insert: {
          category_id?: number
          user_id: string
          title: string
          created_at?: string
        }
        Update: {
          category_id?: number
          user_id?: string
          title?: string
          created_at?: string
        }
      }
      links: {
        Row: {
          id: string
          created_at: string
          url: string
          category_id: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          category_id?: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          category_id?: number
          user_id?: string
        }
      }
      users: {
        Row: {
          id: string
          display_name: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
        }
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
  }
}
