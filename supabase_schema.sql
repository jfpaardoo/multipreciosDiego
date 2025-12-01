-- RESET SCHEMA (WARNING: This deletes all data to ensure a clean setup)
drop table if exists public.promociones cascade;
drop table if exists public.valoraciones cascade;
drop table if exists public.reservas cascade;
drop table if exists public.incidencias cascade;
drop table if exists public.lineas_pedido cascade;
drop table if exists public.pedidos_proveedor cascade;
drop table if exists public.pedidos_cliente cascade;
drop table if exists public.productos cascade;
drop table if exists public.servicios_reparto cascade;
drop table if exists public.proveedores cascade;
drop table if exists public.categorias cascade;
drop table if exists public.profiles cascade;

drop type if exists public.estado_reserva cascade;
drop type if exists public.estado_incidencia cascade;
drop type if exists public.tipo_incidencia cascade;
drop type if exists public.metodo_pago_cliente cascade;
drop type if exists public.estado_pedido_proveedor cascade;
drop type if exists public.estado_pedido_cliente cascade;
drop type if exists public.user_role cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ENUMS
create type user_role as enum ('CLIENTE', 'ADMIN', 'ENCARGADO');
create type estado_pedido_cliente as enum ('EN_PREPARACION', 'ENVIADO', 'EN_REPARTO', 'ENTREGADO', 'CANCELADO');
create type estado_pedido_proveedor as enum ('SOLICITADO', 'ENVIADO_POR_PROVEEDOR', 'RECIBIDO', 'CANCELADO');
create type metodo_pago_cliente as enum ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CONTRA_REEMBOLSO', 'PAYPAL', 'BIZUM');
create type tipo_incidencia as enum ('CON_RETRASO', 'DAÑADO', 'DEVUELTO', 'PERDIDO', 'FALLO_DE_PAGO');
create type estado_incidencia as enum ('PENDIENTE', 'ACEPTADA', 'RECHAZADA');
create type estado_reserva as enum ('PENDIENTE', 'PAGADA', 'RECOGIDA');

-- PROFILES (Cliente hereda de Persona)
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

-- CATEGORIAS
create table public.categorias (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null,
  descripcion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROVEEDORES (Proveedor hereda de Persona)
create table public.proveedores (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null,
  correo text,
  numero text,
  direccion text,
  codigo_postal text,
  cif text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICIOS DE REPARTO
create table public.servicios_reparto (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null,
  tarifa decimal(10,2) not null check (tarifa >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS (con campos actualizados)
create table public.productos (
  id uuid default uuid_generate_v4() primary key,
  referencia text unique not null,
  nombre text not null,
  descripcion text,
  precio_por_mayor decimal(10,2) not null check (precio_por_mayor >= 0),
  precio_venta decimal(10,2) not null check (precio_venta >= 0),
  cantidad_en_tienda integer not null default 0,
  imagen_producto text,
  categoria_id uuid references public.categorias(id) on delete set null,
  activo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PEDIDOS CLIENTE (PedidoCliente)
create table public.pedidos_cliente (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.profiles(id) on delete set null,
  fecha_hora_pedido timestamp with time zone default timezone('utc'::text, now()) not null,
  pagado boolean default false,
  estado estado_pedido_cliente default 'EN_PREPARACION'::estado_pedido_cliente,
  a_domicilio boolean not null,
  metodo_pago metodo_pago_cliente not null,
  direccion_envio text,
  servicio_reparto_id uuid references public.servicios_reparto(id) on delete set null,
  total decimal(10,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PEDIDOS PROVEEDOR (PedidoProveedor)
create table public.pedidos_proveedor (
  id uuid default uuid_generate_v4() primary key,
  proveedor_id uuid references public.proveedores(id) on delete set null,
  fecha_hora_pedido timestamp with time zone default timezone('utc'::text, now()) not null,
  pagado boolean default false,
  estado estado_pedido_proveedor default 'SOLICITADO'::estado_pedido_proveedor,
  total decimal(10,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS (LineaPedido - para ambos tipos de pedido)
create table public.lineas_pedido (
  id uuid default uuid_generate_v4() primary key,
  pedido_cliente_id uuid references public.pedidos_cliente(id) on delete cascade,
  pedido_proveedor_id uuid references public.pedidos_proveedor(id) on delete cascade,
  producto_id uuid references public.productos(id) on delete set null,
  cantidad integer not null check (cantidad > 0),
  precio_unitario decimal(10,2) not null check (precio_unitario >= 0),
  constraint linea_pedido_tipo check (
    (pedido_cliente_id is not null and pedido_proveedor_id is null) or
    (pedido_cliente_id is null and pedido_proveedor_id is not null)
  )
);

-- ISSUES (Incidencia)
create table public.incidencias (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.profiles(id) on delete set null,
  pedido_cliente_id uuid references public.pedidos_cliente(id) on delete set null,
  descripcion text not null,
  tipo_incidencia tipo_incidencia not null,
  estado estado_incidencia default 'PENDIENTE'::estado_incidencia,
  resuelta boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESERVATIONS (Reserva)
create table public.reservas (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.profiles(id) on delete set null,
  producto_id uuid references public.productos(id) on delete set null,
  codigo text unique not null,
  fecha_hora_reserva timestamp with time zone default timezone('utc'::text, now()) not null,
  cantidad integer not null default 1,
  estado estado_reserva default 'PENDIENTE'::estado_reserva,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS (Valoracion)
create table public.valoraciones (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.profiles(id) on delete set null,
  producto_id uuid references public.productos(id) on delete cascade not null,
  estrellas integer not null check (estrellas >= 1 and estrellas <= 5),
  comentario text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROMOTIONS (Promocion)
create table public.promociones (
  id uuid default uuid_generate_v4() primary key,
  producto_id uuid references public.productos(id) on delete cascade not null,
  descripcion text not null,
  descuento decimal(5,2) not null check (descuento >= 0 and descuento <= 100),
  fecha_hora_inicio timestamp with time zone not null,
  fecha_hora_fin timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.categorias enable row level security;
alter table public.proveedores enable row level security;
alter table public.servicios_reparto enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos_cliente enable row level security;
alter table public.pedidos_proveedor enable row level security;
alter table public.lineas_pedido enable row level security;
alter table public.incidencias enable row level security;
alter table public.reservas enable row level security;
alter table public.valoraciones enable row level security;
alter table public.promociones enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Categorias policies
create policy "Categorias are viewable by everyone" on public.categorias for select using (true);
create policy "Only admins/encargados can manage categorias" on public.categorias for all using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Proveedores policies
create policy "Only admins/encargados can view proveedores" on public.proveedores for select using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Only admins/encargados can manage proveedores" on public.proveedores for all using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Servicios Reparto policies
create policy "Servicios reparto are viewable by everyone" on public.servicios_reparto for select using (true);
create policy "Only admins/encargados can manage servicios reparto" on public.servicios_reparto for all using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Products policies
create policy "Products are viewable by everyone" on public.productos for select using (true);
create policy "Only admins/encargados can insert products" on public.productos for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Only admins/encargados can update products" on public.productos for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Only admins/encargados can delete products" on public.productos for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Pedidos Cliente policies
create policy "Users can view their own orders" on public.pedidos_cliente for select using (
  auth.uid() = cliente_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own orders" on public.pedidos_cliente for insert with check (auth.uid() = cliente_id);
create policy "Admins/Encargados can update orders" on public.pedidos_cliente for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can update their own orders" on public.pedidos_cliente for update using (
  auth.uid() = cliente_id and estado = 'EN_PREPARACION'::estado_pedido_cliente
);
create policy "Users can delete their own orders" on public.pedidos_cliente for delete using (
  auth.uid() = cliente_id and estado = 'EN_PREPARACION'::estado_pedido_cliente
);

-- Pedidos Proveedor policies
create policy "Only admins/encargados can manage pedidos proveedor" on public.pedidos_proveedor for all using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Order Items policies
create policy "Users can view their own order items" on public.lineas_pedido for select using (
  exists (
    select 1 from public.pedidos_cliente where id = lineas_pedido.pedido_cliente_id 
    and (cliente_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO')))
  ) or exists (
    select 1 from public.pedidos_proveedor where id = lineas_pedido.pedido_proveedor_id 
    and exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
  )
);
create policy "Users can insert their own order items" on public.lineas_pedido for insert with check (
  exists (select 1 from public.pedidos_cliente where id = lineas_pedido.pedido_cliente_id and cliente_id = auth.uid())
  or exists (select 1 from public.pedidos_proveedor where id = lineas_pedido.pedido_proveedor_id and exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO')))
);

-- Issues policies
create policy "Users can view their own issues" on public.incidencias for select using (
  auth.uid() = cliente_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own issues" on public.incidencias for insert with check (auth.uid() = cliente_id);
create policy "Admins/Encargados can update issues" on public.incidencias for update using (
  exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);

-- Reservations policies
create policy "Users can view their own reservations" on public.reservas for select using (
  auth.uid() = cliente_id or exists (select 1 from public.profiles where id = auth.uid() and rol in ('ADMIN', 'ENCARGADO'))
);
create policy "Users can insert their own reservations" on public.reservas for insert with check (auth.uid() = cliente_id);
-- Insert categorias
insert into public.categorias (nombre, descripcion) values
('Electrónica', 'Dispositivos y accesorios electrónicos'),
('Hogar', 'Artículos para el hogar y decoración'),
('Cocina', 'Utensilios y electrodomésticos de cocina'),
('Iluminación', 'Lámparas y sistemas de iluminación'),
('Papelería', 'Material escolar y de oficina');

-- Insert dummy products
insert into public.productos (referencia, nombre, descripcion, precio_por_mayor, precio_venta, cantidad_en_tienda, imagen_producto, categoria_id) 
select 
  'REF001', 
  'Auriculares Bluetooth', 
  'Auriculares inalámbricos con cancelación de ruido.', 
  20.00, 
  29.99, 
  50, 
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  id 
from public.categorias where nombre = 'Electrónica';

insert into public.productos (referencia, nombre, descripcion, precio_por_mayor, precio_venta, cantidad_en_tienda, imagen_producto, categoria_id) 
select 
  'REF002', 
  'Árbol de Navidad', 
  'Árbol artificial de 180cm, frondoso.', 
  30.00, 
  45.50, 
  20, 
  'https://images.unsplash.com/photo-1544084944-152696a63f72?w=500&q=80',
  id 
from public.categorias where nombre = 'Hogar';

insert into public.productos (referencia, nombre, descripcion, precio_por_mayor, precio_venta, cantidad_en_tienda, imagen_producto, categoria_id) 
select 
  'REF003', 
  'Juego de Sartenes', 
  'Set de 3 sartenes antiadherentes.', 
  22.00, 
  35.00, 
  30, 
  'https://images.unsplash.com/photo-1584992236310-6eddd724a4c7?w=500&q=80',
  id 
from public.categorias where nombre = 'Cocina';

insert into public.productos (referencia, nombre, descripcion, precio_por_mayor, precio_venta, cantidad_en_tienda, imagen_producto, categoria_id) 
select 
  'REF004', 
  'Lámpara LED Escritorio', 
  'Lámpara flexible con 3 modos de luz.', 
  10.00, 
  15.99, 
  100, 
  'https://images.unsplash.com/photo-1534073828943-f801091a7d58?w=500&q=80',
  id 
from public.categorias where nombre = 'Iluminación';

insert into public.productos (referencia, nombre, descripcion, precio_por_mayor, precio_venta, cantidad_en_tienda, imagen_producto, categoria_id) 
select 
  'REF005', 
  'Mochila Escolar', 
  'Mochila resistente con compartimento para portátil.', 
  15.00, 
  22.50, 
  40, 
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  id 
from public.categorias where nombre = 'Papelería';

-- TRIGGERS
-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nombre, apellidos, rol)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellidos',
    'CLIENTE'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- FUNCTIONS
create or replace function decrement_stock(product_id uuid, quantity int)
returns void as $$
begin
  update public.productos
  set cantidad_en_tienda = cantidad_en_tienda - quantity
  where id = product_id;
end;
$$ language plpgsql security definer;
