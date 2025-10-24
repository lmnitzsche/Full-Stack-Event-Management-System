-- Set admin privileges for specified email addresses
-- This script will update existing profiles or create them if they don't exist

-- Update existing profiles to admin
UPDATE profiles 
SET is_admin = true 
WHERE email IN ('lnitzsc@siue.edu', 'logannitzsche1@gmail.com');

-- Check if the updates were successful
SELECT email, full_name, is_admin, created_at 
FROM profiles 
WHERE email IN ('lnitzsc@siue.edu', 'logannitzsche1@gmail.com');

-- If no rows were affected, it means the profiles don't exist yet
-- They will be created automatically when those users first sign up
-- But we can also insert them manually if needed:

-- INSERT INTO profiles (id, email, is_admin, created_at, updated_at)
-- SELECT 
--   gen_random_uuid(),
--   email,
--   true,
--   now(),
--   now()
-- FROM (VALUES ('lnitzsc@siue.edu'), ('logannitzsche1@gmail.com')) AS emails(email)
-- WHERE NOT EXISTS (
--   SELECT 1 FROM profiles WHERE profiles.email = emails.email
-- );