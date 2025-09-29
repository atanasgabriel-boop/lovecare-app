import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  subscription_type: 'free' | 'premium'
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  user_id: string
  ai_type: 'girlfriend' | 'boyfriend' | 'therapist' | 'friend'
  message: string
  response: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: 'premium'
  status: 'active' | 'cancelled' | 'expired'
  started_at: string
  expires_at: string
  created_at: string
}