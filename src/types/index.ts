export type UserRole = 'CLIENTE' | 'ADMIN' | 'ENCARGADO';
export type EstadoPedidoCliente = 'EN_PREPARACION' | 'ENVIADO' | 'EN_REPARTO' | 'ENTREGADO' | 'CANCELADO';
export type EstadoPedidoProveedor = 'SOLICITADO' | 'ENVIADO_POR_PROVEEDOR' | 'RECIBIDO' | 'CANCELADO';
export type MetodoPagoCliente = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CONTRA_REEMBOLSO' | 'PAYPAL' | 'BIZUM';
export type TipoIncidencia = 'CON_RETRASO' | 'DAÑADO' | 'DEVUELTO' | 'PERDIDO' | 'FALLO_DE_PAGO';
export type EstadoIncidencia = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
export type EstadoReserva = 'PENDIENTE' | 'PAGADA' | 'RECOGIDA';

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

export interface Categoria {
    id: string;
    nombre: string;
    descripcion: string | null;
    created_at: string;
}

export interface Proveedor {
    id: string;
    nombre: string;
    correo: string | null;
    numero: string | null;
    direccion: string | null;
    codigo_postal: string | null;
    cif: string | null;
    created_at: string;
}

export interface ServicioReparto {
    id: string;
    nombre: string;
    tarifa: number;
    created_at: string;
}

export interface Product {
    id: string;
    referencia: string;
    nombre: string;
    descripcion: string | null;
    precio_por_mayor: number;
    precio_venta: number;
    cantidad_en_tienda: number;
    imagen_producto: string | null;
    categoria_id: string | null;
    activo: boolean;
    created_at: string;
    // Joined fields
    categorias?: Categoria;
}

export interface PedidoCliente {
    id: string;
    cliente_id: string | null;
    fecha_hora_pedido: string;
    pagado: boolean;
    estado: EstadoPedidoCliente;
    a_domicilio: boolean;
    metodo_pago: MetodoPagoCliente;
    direccion_envio: string | null;
    servicio_reparto_id: string | null;
    total: number;
    created_at: string;
    // Joined fields
    servicios_reparto?: ServicioReparto;
}

export interface PedidoProveedor {
    id: string;
    proveedor_id: string | null;
    fecha_hora_pedido: string;
    pagado: boolean;
    estado: EstadoPedidoProveedor;
    total: number;
    created_at: string;
    // Joined fields
    proveedores?: Proveedor;
}

export interface LineaPedido {
    id: string;
    pedido_cliente_id: string | null;
    pedido_proveedor_id: string | null;
    producto_id: string | null;
    cantidad: number;
    precio_unitario: number;
    // Joined fields
    productos?: Product;
}

export interface Incidencia {
    id: string;
    cliente_id: string | null;
    pedido_cliente_id: string | null;
    descripcion: string;
    tipo_incidencia: TipoIncidencia;
    estado: EstadoIncidencia;
    resuelta: boolean;
    created_at: string;
    // Joined fields
    profiles?: Profile;
    pedidos_cliente?: PedidoCliente;
}

export interface Reserva {
    id: string;
    cliente_id: string | null;
    producto_id: string | null;
    codigo: string;
    fecha_hora_reserva: string;
    cantidad: number;
    estado: EstadoReserva;
    created_at: string;
    // Joined fields
    productos?: Product;
}

export interface Valoracion {
    id: string;
    cliente_id: string | null;
    producto_id: string;
    estrellas: number;
    comentario: string | null;
    created_at: string;
    // Joined fields
    profiles?: Profile;
}

export interface Promocion {
    id: string;
    producto_id: string;
    descripcion: string;
    descuento: number;
    fecha_hora_inicio: string;
    fecha_hora_fin: string;
    created_at: string;
}
