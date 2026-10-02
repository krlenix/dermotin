-- Additive only: existing orders and delivery payloads are never renamed.
begin;

create sequence if not exists public.checkout_order_number_seq
  as bigint start with 100001 minvalue 100001 no cycle;

create table if not exists public.checkout_order_numbers (
  event_key text primary key check (event_key ~ '^[0-9a-f]{64}$'),
  domain text not null check (domain in ('dermotin.shop', 'www.dermotin.shop')),
  order_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.checkout_order_numbers enable row level security;
revoke all on table public.checkout_order_numbers from public, anon, authenticated;
revoke all on sequence public.checkout_order_number_seq from public, anon, authenticated;
grant select, insert on table public.checkout_order_numbers to service_role;
grant usage on sequence public.checkout_order_number_seq to service_role;

create or replace function public.reserve_checkout_order_number(p_domain text, p_event_key text)
returns text
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  result_id text;
  previous_id text := 'WEB-' || left(p_event_key, 40);
begin
  if p_domain is null or p_domain not in ('dermotin.shop', 'www.dermotin.shop')
    or p_event_key is null or p_event_key !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid checkout numbering scope';
  end if;

  -- Concurrent retries serialize here; distinct checkouts use a unique sequence.
  perform pg_advisory_xact_lock(hashtextextended(p_event_key, 0));
  select n.order_id into result_id from public.checkout_order_numbers n
    where n.event_key = p_event_key and n.domain = p_domain;
  if result_id is not null then return result_id; end if;

  -- A checkout accepted before this migration must retain its original ID.
  if exists (select 1 from public.oms_deliveries d
      where d.target = 'legacy' and d.kind = 'order'
        and d.context->>'domain' = p_domain and d.payload->>'order_id' = previous_id)
    or exists (select 1 from public.orders o where o.order_id = previous_id and o.domain = p_domain) then
    result_id := previous_id;
  else
    loop
      result_id := nextval('public.checkout_order_number_seq')::text;
      -- Also avoid an already-used numeric ID from a historical import.
      exit when not exists (select 1 from public.orders o where o.order_id = result_id)
        and not exists (select 1 from public.checkout_order_numbers n where n.order_id = result_id)
        and not exists (select 1 from public.oms_deliveries d
          where d.kind = 'order' and (d.payload->>'order_id' = result_id or d.payload->>'id' = result_id));
    end loop;
  end if;

  insert into public.checkout_order_numbers(event_key, domain, order_id)
    values (p_event_key, p_domain, result_id);
  return result_id;
end;
$$;

revoke all on function public.reserve_checkout_order_number(text, text) from public, anon, authenticated;
grant execute on function public.reserve_checkout_order_number(text, text) to service_role;

commit;
