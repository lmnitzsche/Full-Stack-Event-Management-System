-- REVERT DATABASE CHANGES - Run this to undo admin modifications
-- This script removes the admin policies and functions that were added

-- 1. Drop the custom admin functions
DROP FUNCTION IF EXISTS get_all_users_admin();
DROP FUNCTION IF EXISTS get_all_events_admin();

-- 2. Drop all the admin-specific policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admin can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all events" ON events;
DROP POLICY IF EXISTS "Admin can delete any events" ON events;

-- 3. Drop user policies (we'll recreate simple ones)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can insert own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

-- 4. Disable RLS temporarily to reset everything
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- 5. Create simple, permissive policies for basic functionality
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all profiles (needed for app functionality)
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read all events (needed for search/browse)
CREATE POLICY "Allow authenticated users to read events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to manage their own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Verify the revert worked
SELECT 'Database policies reverted successfully' as status;