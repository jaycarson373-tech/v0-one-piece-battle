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

create table if not exists public.vault_cards (
  id text primary key,
  name text not null,
  grade text,
  tier text not null,
  value_usd numeric not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'airdropped')),
  assigned_to text,
  assigned_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.proof_log (
  event_id text primary key,
  event_type text not null,
  winner_wallet text,
  slab_id text,
  vrf_proof text,
  result_hash text,
  timestamp timestamptz not null default now(),
  status text not null default 'settled'
);

alter table public.vault_cards enable row level security;
alter table public.proof_log enable row level security;

drop policy if exists "Anyone can read vault_cards" on public.vault_cards;
drop policy if exists "Anyone can read proof_log" on public.proof_log;
drop policy if exists "Anyone can insert proof_log" on public.proof_log;
drop policy if exists "Anyone can update vault_cards" on public.vault_cards;
drop policy if exists "Anyone can insert vault_cards" on public.vault_cards;

create policy "Anyone can read vault_cards" on public.vault_cards for select using (true);
create policy "Anyone can read proof_log" on public.proof_log for select using (true);
create policy "Anyone can insert proof_log" on public.proof_log for insert with check (true);
create policy "Anyone can update vault_cards" on public.vault_cards for update using (true);
create policy "Anyone can insert vault_cards" on public.vault_cards for insert with check (true);

alter table public.vault_cards replica identity full;
alter table public.proof_log replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.vault_cards;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.proof_log;
exception
  when duplicate_object then null;
end $$;
