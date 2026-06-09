create table if not exists public.duels (
  id text primary key,
  creator_wallet text not null,
  acceptor_wallet text,
  status text not null default 'open' check (status in ('open', 'resolving', 'resolved')),
  winner_wallet text,
  vrf_proof text,
  result_hash text,
  created_at timestamptz not null default now()
);

alter table public.duels replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.duels;
exception
  when duplicate_object then null;
end $$;
