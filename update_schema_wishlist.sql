-- Create wishlist table
create table if not exists public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.profiles(id) on delete cascade not null,
  producto_id uuid references public.productos(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cliente_id, producto_id)
);

-- Enable RLS
alter table public.wishlist enable row level security;

-- Policies
create policy "Users can view their own wishlist" on public.wishlist 
  for select using (auth.uid() = cliente_id);

create policy "Users can insert into their own wishlist" on public.wishlist 
  for insert with check (auth.uid() = cliente_id);

create policy "Users can delete from their own wishlist" on public.wishlist 
  for delete using (auth.uid() = cliente_id);
