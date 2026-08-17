-- Fix 401 Unauthorized for users table
GRANT SELECT ON public.users TO anon;
-- If Row Level Security is enabled, we need to add a policy as well
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon" ON users;
CREATE POLICY "Enable all for anon" ON users FOR ALL USING (true);
