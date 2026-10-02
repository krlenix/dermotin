-- Run once in the existing Supabase project's SQL editor before enabling TopOMS.
-- Additive: existing orders and policies are left untouched.
begin;
create table if not exists public.oms_deliveries (
  id text primary key,
  store_id text not null,
  target text not null check (target in ('legacy', 'topoms')),
  kind text not null check (kind in ('order', 'product')),
  payload jsonb not null,
  context jsonb not null default '{}'::jsonb,
  state text not null default 'pending' check (state in ('pending', 'processing', 'retry', 'blocked', 'delivered')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  claim_token uuid,
  last_error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);
create index if not exists oms_deliveries_pending on public.oms_deliveries(store_id, state, next_attempt_at);
alter table public.oms_deliveries enable row level security;
revoke all on public.oms_deliveries from public, anon, authenticated;
grant select, insert, update, delete on public.oms_deliveries to service_role;

-- One worker owns a delivery at a time, including across serverless instances.
create or replace function public.claim_oms_delivery(p_store_id text)
returns setof public.oms_deliveries
language sql security invoker set search_path = public as $$
  update public.oms_deliveries
  set state = 'processing', locked_until = now() + interval '5 minutes',
      claim_token = gen_random_uuid(), attempts = attempts + 1
  where id = (
    select id from public.oms_deliveries
    where store_id = p_store_id and (
      (state in ('pending', 'retry') and next_attempt_at <= now()) or
      (state = 'processing' and locked_until < now())
    )
    order by case when target = 'legacy' then 0 when kind = 'product' then 1 else 2 end,
      next_attempt_at, created_at, id
    for update skip locked limit 1
  ) returning *;
$$;
revoke all on function public.claim_oms_delivery(text) from public, anon, authenticated;
grant execute on function public.claim_oms_delivery(text) to service_role;
commit;
