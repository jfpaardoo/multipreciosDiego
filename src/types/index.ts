export type UserRole = 'CLIENTE' | 'ADMIN' | 'ENCARGADO';
export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
export type DeliveryType = 'DOMICILIO' | 'RECOGIDA';
export type PaymentMethod = 'TARJETA' | 'EFECTIVO' | 'BIZUM';
export type IssueType = 'RETRASO' | 'DAÑADO' | 'DEVUELTO';
export type IssueStatus = 'PENDIENTE' | 'RESUELTA';
export type ReservationStatus = 'PENDIENTE' | 'PAGADA' | 'RECOGIDA';

export interface Profile {
    id: string;
    email: string;
    nombre: string | null;
    apellidos: string | null;
    telefono: string | null;
    direccion: string | null;
    codigo_postal: string | null;
    dni: string | null;
    rol: UserRole;
    created_at: string;
}

export interface Product {
    id: string;
    referencia: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: number;
    categoria: string | null;
    imagen_url: string | null;
    activo: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    usuario_id: string | null;
    fecha: string;
    total: number;
    estado: OrderStatus;
    tipo_entrega: DeliveryType;
    metodo_pago: PaymentMethod;
    direccion_envio: string | null;
    created_at: string;
}

export interface OrderItem {
    id: string;
    pedido_id: string;
    producto_id: string | null;
    cantidad: number;
    precio_unitario: number;
    // Joined fields
    productos?: Product;
}

export interface Issue {
    id: string;
    usuario_id: string | null;
    pedido_id: string | null;
    descripcion: string;
    tipo: IssueType;
    estado: IssueStatus;
    created_at: string;
    // Joined fields
    profiles?: Profile;
    pedidos?: Order;
}

export interface Reservation {
    id: string;
    usuario_id: string | null;
    producto_id: string | null;
    codigo: string;
    fecha_reserva: string;
    cantidad: number;
    estado: ReservationStatus;
    created_at: string;
    // Joined fields
    productos?: Product;
}

export interface Review {
    id: string;
    usuario_id: string | null;
    producto_id: string;
    estrellas: number;
    comentario: string | null;
    created_at: string;
    // Joined fields
    profiles?: Profile;
}

export interface Promotion {
    id: string;
    producto_id: string;
    descripcion: string;
    descuento: number;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
}
