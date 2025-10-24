-- Create admin functions that bypass RLS
-- These functions will be called from the admin dashboard

-- Function to get all users for admin
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  is_admin boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
SECURITY DEFINER
LANGUAGE sql
AS $$
  -- Only allow admins to call this function
  SELECT 
    p.id, 
    p.email, 
    p.full_name, 
    p.is_admin, 
    p.created_at, 
    p.updated_at
  FROM profiles p
  WHERE 
    -- Verify the calling user is an admin
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  ORDER BY p.created_at DESC;
$$;

-- Function to get all events for admin
CREATE OR REPLACE FUNCTION get_all_events_admin()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  event_id text,
  name text,
  venue text,
  date date,
  description text,
  rating numeric,
  category text,
  api_data jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_email text,
  user_name text
)
SECURITY DEFINER
LANGUAGE sql
AS $$
  -- Only allow admins to call this function
  SELECT 
    e.id,
    e.user_id,
    e.event_id,
    e.name,
    e.venue,
    e.date,
    e.description,
    e.rating,
    e.category,
    e.api_data,
    e.created_at,
    e.updated_at,
    p.email as user_email,
    p.full_name as user_name
  FROM events e
  LEFT JOIN profiles p ON e.user_id = p.id
  WHERE 
    -- Verify the calling user is an admin
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  ORDER BY e.created_at DESC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_events_admin() TO authenticated;