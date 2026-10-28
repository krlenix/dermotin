-- Porudžbine (lični podaci kupaca) sme da čita i piše samo server sa service-role ključem.
-- Stara politika "Allow all operations for service role" nije imala `TO service_role`,
-- pa je važila i za anon ključ — svako ko ima anon ključ mogao je da čita sve porudžbine.
--
-- PRE pokretanja: na Vercelu postaviti SUPABASE_SERVICE_ROLE_KEY (aplikacija ga koristi
-- u src/lib/supabase.ts). Service role zaobilazi RLS, pa porudžbine nastavljaju da rade.

DROP POLICY IF EXISTS "Allow all operations for service role" ON public.orders;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Bez ijedne politike za anon/authenticated: RLS odbija sve zahteve sa tim ključevima.
REVOKE ALL ON public.orders FROM anon, authenticated;
