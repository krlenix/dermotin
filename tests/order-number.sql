-- Run after the numbering migration. Synthetic fixtures are rolled back;
-- no order is submitted to either OMS. Sequence gaps from tests are normal.
begin;
set local role service_role;
do $$
declare
  key_one text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  key_two text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  key_old text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  first_id text;
  second_id text;
  old_id text := 'WEB-' || left(key_old, 40);
begin
  first_id := public.reserve_checkout_order_number('dermotin.shop', key_one);
  if first_id !~ '^[1-9][0-9]{5,18}$' then raise exception 'Number format failed'; end if;
  if public.reserve_checkout_order_number('dermotin.shop', key_one) <> first_id then
    raise exception 'Retry stability failed';
  end if;
  second_id := public.reserve_checkout_order_number('dermotin.shop', key_two);
  if first_id = second_id then raise exception 'Distinct checkout uniqueness failed'; end if;

  -- Invisible until commit (which never happens), and outside the real store.
  insert into public.oms_deliveries(id, store_id, target, kind, payload, context, state)
    values ('numbering-test-' || key_old, 'numbering-test', 'legacy', 'order',
      jsonb_build_object('order_id', old_id), jsonb_build_object('domain', 'dermotin.shop'), 'delivered');
  if public.reserve_checkout_order_number('dermotin.shop', key_old) <> old_id then
    raise exception 'Pre-migration checkout identity changed';
  end if;
  if public.reserve_checkout_order_number('dermotin.shop', key_old) <> old_id then
    raise exception 'Pre-migration retry identity changed';
  end if;
end;
$$;
rollback;

select
  (select relrowsecurity from pg_class where oid = 'public.checkout_order_numbers'::regclass) as rls_enabled,
  has_table_privilege('anon', 'public.checkout_order_numbers', 'SELECT,INSERT,UPDATE,DELETE') as anon_table_access,
  has_table_privilege('authenticated', 'public.checkout_order_numbers', 'SELECT,INSERT,UPDATE,DELETE') as authenticated_table_access,
  has_function_privilege('anon', 'public.reserve_checkout_order_number(text,text)', 'EXECUTE') as anon_can_reserve,
  has_function_privilege('authenticated', 'public.reserve_checkout_order_number(text,text)', 'EXECUTE') as authenticated_can_reserve,
  has_function_privilege('service_role', 'public.reserve_checkout_order_number(text,text)', 'EXECUTE') as service_can_reserve,
  (select prosecdef from pg_proc where oid = 'public.reserve_checkout_order_number(text,text)'::regprocedure) as security_definer,
  (select count(*) from public.oms_deliveries where store_id = 'numbering-test') as remaining_test_deliveries;
