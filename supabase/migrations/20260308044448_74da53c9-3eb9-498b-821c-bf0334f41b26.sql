
-- Add admin role for vermatamanna409@gmail.com (missing from user_roles)
INSERT INTO public.user_roles (user_id, role)
VALUES ('4747dbb4-a7d2-4972-bdad-f9e2f15fd147', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update trigger function to include both admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email IN ('vermatamanna158@gmail.com', 'vermatamanna409@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
