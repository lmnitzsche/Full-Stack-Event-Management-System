import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema comments for reference:
/*
  Events table:
  - id (uuid, primary key)
  - user_id (uuid, foreign key to auth.users)
  - event_id (text, external API event ID)
  - name (text)
  - venue (text)
  - date (date)
  - description (text, optional)
  - rating (numeric 1-10)
  - category (text: 'concert' | 'festival' | 'sports' | 'theater' | 'other')
  - api_data (jsonb, store original API response)
  - created_at (timestamp)
  - updated_at (timestamp)
  
  Users table (extends auth.users):
  - id (uuid, primary key)
  - email (text)
  - full_name (text, optional)
  - avatar_url (text, optional)
  - is_admin (boolean, default false)
  - created_at (timestamp)
*/