-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ENUMS
create type user_role as enum ('CLIENTE', 'ADMIN', 'ENCARGADO');
create type order_status as enum ('PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO');
create type delivery_type as enum ('DOMICILIO', 'RECOGIDA');
create type payment_method as enum ('TARJETA', 'EFECTIVO', 'BIZUM');
create type issue_type as enum ('RETRASO', 'DAÑADO', 'DEVUELTO');
create type issue_status as enum ('PENDIENTE', 'RESUELTA');
create type reservation_status as enum ('PENDIENTE', 'PAGADA', 'RECOGIDA');

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  nombre text,
  apellidos text,
  telefono text,
  direccion text,
  codigo_postal text,
  dni text,
  rol user_role default 'CLIENTE'::user_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.productos (
  id uuid default uuid_generate_v4() primary key,
  referencia text unique not null,
  nombre text not null,
  descripcion text,
  precio decimal(10,2) not null check (precio >= 0),
  stock integer not null default 0,
  categoria text,
  imagen_url text,
  activo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.pedidos (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.profiles(id) on delete set null,
  fecha timestamp with time zone default timezone('utc'::text, now()) not null,
  total decimal(10,2) not null default 0,
  estado order_status default 'PENDIENTE'::order_status,
  tipo_entrega delivery_type not null,
  metodo_pago payment_method not null,
  direccion_envio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.lineas_pedido (
  id uuid default uuid_generate_v4() primary key,
  pedido_id uuid references public.pedidos(id) on delete cascade not null,
  producto_id uuid references public.productos(id) on delete set null,
  cantidad integer not null check (cantidad > 0),
  precio_unitario decimal(10,2) not null check (precio_unitario >= 0)
);

-- ISSUES
create table public.incidencias (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.profiles(id) on delete set null,
  pedido_id uuid references public.pedidos(id) on delete set null,
  descripcion text not null,
  tipo issue_type not null,
  estado issue_status default 'PENDIENTE'::issue_status,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESERVATIONS (New)
create table public.reservas (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.profiles(id) on delete set null,
  producto_id uuid references public.productos(id) on delete set null,
  codigo text unique not null,
  fecha_reserva timestamp with time zone default timezone('utc'::text, now()) not null,
  cantidad integer not null default 1,
  estado reservation_status default 'PENDIENTE'::reservation_status,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS (New)
create table public.valoraciones (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.profiles(id) on delete set null,
  producto_id uuid references public.productos(id) on delete cascade not null,
  estrellas integer not null check (estrellas >= 1 and estrellas <= 5),
  comentario text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROMOTIONS (New)
create table public.promociones (
  id uuid default uuid_generate_v4() primary key,
  producto_id uuid references public.productos(id) on delete cascade not null,
  descripcion text not null,
  descuento decimal(5,2) not null check (descuento >= 0 and descuento <= 100), -- Percentage
  fecha_inicio timestamp with time zone not null,
  fecha_fin timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.lineas_pedido enable row level security;
alter table public.incidencias enable row level security;
alter table public.reservas enable row level security;
alter table public.valoraciones enable row level security;
alter table public.promociones enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products policies
create policy "Products are viewable by everyone" on public.productos for select using (true);
create policy "Only admins/encargados can insert products" on public.productos for insert using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Only admins/encargados can update products" on public.productos for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Only admins/encargados can delete products" on public.productos for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Orders policies
create policy "Users can view their own orders" on public.pedidos for select using (
  auth.uid() = usuario_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own orders" on public.pedidos for insert with check (auth.uid() = usuario_id);
create policy "Admins/Encargados can update orders" on public.pedidos for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Order Items policies
create policy "Users can view their own order items" on public.lineas_pedido for select using (
  exists (select 1 from public.pedidos where id = lineas_pedido.pedido_id and (usuario_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))))
);
create policy "Users can insert their own order items" on public.lineas_pedido for insert with check (
  exists (select 1 from public.pedidos where id = lineas_pedido.pedido_id and usuario_id = auth.uid())
);

-- Issues policies
create policy "Users can view their own issues" on public.incidencias for select using (
  auth.uid() = usuario_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own issues" on public.incidencias for insert with check (auth.uid() = usuario_id);
create policy "Admins/Encargados can update issues" on public.incidencias for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Reservations policies
create policy "Users can view their own reservations" on public.reservas for select using (
  auth.uid() = usuario_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own reservations" on public.reservas for insert with check (auth.uid() = usuario_id);
create policy "Admins/Encargados can update reservations" on public.reservas for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Reviews policies
create policy "Reviews are viewable by everyone" on public.valoraciones for select using (true);
create policy "Users can insert their own reviews" on public.valoraciones for insert with check (auth.uid() = usuario_id);

-- Promotions policies
create policy "Promotions are viewable by everyone" on public.promociones for select using (true);
create policy "Only admins/encargados can manage promotions" on public.promociones for all using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- SEED DATA
-- Insert dummy products
insert into public.productos (referencia, nombre, descripcion, precio, stock, categoria, imagen_url) values
('REF001', 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido.', 29.99, 50, 'Electrónica', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'),
('REF002', 'Árbol de Navidad', 'Árbol artificial de 180cm, frondoso.', 45.50, 20, 'Hogar', 'https://images.unsplash.com/photo-1544084944-152696a63f72?w=500&q=80'),
('REF003', 'Juego de Sartenes', 'Set de 3 sartenes antiadherentes.', 35.00, 30, 'Cocina', 'https://images.unsplash.com/photo-1584992236310-6eddd724a4c7?w=500&q=80'),
('REF004', 'Lámpara LED Escritorio', 'Lámpara flexible con 3 modos de luz.', 15.99, 100, 'Iluminación', 'https://images.unsplash.com/photo-1534073828943-f801091a7d58?w=500&q=80'),
('REF005', 'Mochila Escolar', 'Mochila resistente con compartimento para portátil.', 22.50, 40, 'Papelería', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80');
