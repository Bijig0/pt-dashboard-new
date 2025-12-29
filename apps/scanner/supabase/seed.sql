-- Seed file for scanner app
-- This creates a test user for development

-- Insert test user into auth.users
-- Note: The password 'Bryanbrady1' is hashed using bcrypt
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'clbb8.mail@gmail.com',
  crypt('Bryanbrady1', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;
