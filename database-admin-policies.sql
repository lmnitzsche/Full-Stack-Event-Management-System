-- Admin Database Policies for Ticket Padawan
-- This script sets up proper Row Level Security policies for admin users

-- 1. First, let's create admin-specific policies for the profiles table
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- 2. Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Admin can update any profile (for admin promotion/demotion)
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
CREATE POLICY "Admin can update any profile" ON profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- 5. Admin can delete any profile
DROP POLICY IF EXISTS "Admin can delete any profile" ON profiles;
CREATE POLICY "Admin can delete any profile" ON profiles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- 6. Admin can view all events
DROP POLICY IF EXISTS "Admin can view all events" ON events;
CREATE POLICY "Admin can view all events" ON events
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- 7. Users can view their own events
DROP POLICY IF EXISTS "Users can view own events" ON events;
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

-- 8. Users can insert their own events
DROP POLICY IF EXISTS "Users can insert own events" ON events;
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Users can update their own events
DROP POLICY IF EXISTS "Users can update own events" ON events;
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- 10. Users can delete their own events
DROP POLICY IF EXISTS "Users can delete own events" ON events;
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- 11. Admin can delete any event
DROP POLICY IF EXISTS "Admin can delete any events" ON events;
CREATE POLICY "Admin can delete any events" ON events
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- 12. Make sure RLS is enabled on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 13. Grant necessary permissions (if not already granted)
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON events TO authenticated;

-- 14. Set up admin users (update these email addresses as needed)
UPDATE profiles 
SET is_admin = true 
WHERE email IN ('lnitzsc@siue.edu', 'logannitzsche1@gmail.com');

-- 15. Verify admin setup
SELECT 
  email, 
  full_name, 
  is_admin, 
  created_at 
FROM profiles 
WHERE is_admin = true;

-- 16. Test query that should work for admins
-- SELECT COUNT(*) as total_users FROM profiles;
-- SELECT COUNT(*) as total_events FROM events;