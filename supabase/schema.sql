-- O Roubo no Museu — esquema inicial para Supabase
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student','teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  artifact_name text not null,
  artifact_length numeric not null,
  artifact_width numeric not null,
  artifact_height numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  position integer not null,
  title text not null,
  concept text not null,
  prompt text not null,
  hint text,
  answer_key text not null,
  explanation text,
  unique(case_id, position)
);

create table if not exists public.evidences (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.suspects (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  name text not null,
  role text not null,
  access_description text not null,
  is_compatible boolean not null default false
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  answer text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique(user_id, case_id)
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  completed_challenges integer not null default 0,
  total_attempts integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, case_id)
);

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.challenges enable row level security;
alter table public.evidences enable row level security;
alter table public.suspects enable row level security;
alter table public.attempts enable row level security;
alter table public.notes enable row level security;
alter table public.progress enable row level security;

create policy "students can read their profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "authenticated users can read cases" on public.cases for select to authenticated using (true);
create policy "authenticated users can read challenges" on public.challenges for select to authenticated using (true);
create policy "authenticated users can read evidence" on public.evidences for select to authenticated using (true);
create policy "authenticated users can read suspects" on public.suspects for select to authenticated using (true);
create policy "students own attempts" on public.attempts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "students own notes" on public.notes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "students own progress" on public.progress for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- A partir de 30/10/2026, novas tabelas no schema public não ficam automaticamente expostas à Data API.
-- No Dashboard, habilite explicitamente as tabelas acima em Integrations > Data API, mantendo RLS ativo.

-- Create a trusted profile for each new Supabase auth user.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Usuário'),
    case when new.raw_user_meta_data ->> 'role' = 'teacher' then 'teacher' else 'student' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();
