// types/supabase.ts
export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            name: string
            email: string
            role: 'user' | 'admin'
            created_at: string
          }
          Insert: {
            id: string
            name: string
            email: string
            role?: 'user' | 'admin'
            created_at?: string
          }
          Update: {
            name?: string
            email?: string
            role?: 'user' | 'admin'
          }
        }
      }
    }
  }
  