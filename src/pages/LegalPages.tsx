import { Shield, FileText, Scale } from 'lucide-react';

interface LegalSectionProps {
    title: string;
    children: React.ReactNode;
}

function LegalSection({ title, children }: LegalSectionProps) {
    return (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed">
                {children}
            </div>
        </div>
    );
}

interface LegalHeaderProps {
    title: string;
    icon: React.ReactNode;
    lastUpdated?: string;
}

function LegalHeader({ title, icon, lastUpdated }: LegalHeaderProps) {
    return (
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6">
                <div className="text-blue-600">
                    {icon}
                </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            {lastUpdated && (
                <p className="text-gray-500">
                    Última actualización: <span className="font-medium text-gray-900">{lastUpdated}</span>
                </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mt-6 rounded-full"></div>
        </div>
    );
}

export function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title="Política de Privacidad"
                icon={<Shield className="w-8 h-8" />}
                lastUpdated={new Date().toLocaleDateString()}
            />

            <div className="space-y-6">
                <LegalSection title="1. Responsable del tratamiento">
                    <p>
                        <strong>Multiprecios Diego</strong> es el responsable del tratamiento de sus datos personales.
                        Nos comprometemos a proteger su privacidad y asegurar que sus datos estén seguros con nosotros.
                    </p>
                </LegalSection>

                <LegalSection title="2. Finalidad del tratamiento">
                    <p className="mb-4">Tratamos sus datos personales para las siguientes finalidades:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>Gestionar sus pedidos, entregas y facturación.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>Atender sus consultas, dudas o incidencias a través de nuestro soporte.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>Enviarle información sobre nuestros productos y ofertas si nos ha dado su consentimiento expreso.</span>
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. Legitimación">
                    <p>
                        La base legal para el tratamiento de sus datos es la <strong>ejecución del contrato de compraventa</strong> (cuando realiza un pedido)
                        y su <strong>consentimiento explícito</strong> (para el envío de comunicaciones comerciales o el uso de cookies).
                    </p>
                </LegalSection>

                <LegalSection title="4. Destinatarios">
                    <p>
                        No cederemos sus datos a terceros salvo obligación legal o a proveedores que sean estrictamente necesarios
                        para la prestación del servicio, como <strong>empresas de transporte y logística</strong> para entregar sus pedidos.
                    </p>
                </LegalSection>

                <LegalSection title="5. Sus derechos">
                    <p className="mb-4">Como usuario, tiene derecho a:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-900 block mb-1">Acceso y Rectificación</span>
                            <span className="text-sm">Consultar sus datos y corregirlos si son inexactos.</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-900 block mb-1">Supresión</span>
                            <span className="text-sm">Solicitar el borrado de sus datos cuando ya no sean necesarios.</span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        Para ejercer estos derechos, escríbanos a <a href="mailto:multipreciosdiego@gmail.com" className="text-blue-600 hover:underline">multipreciosdiego@gmail.com</a>
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}

export function LegalNotice() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title="Aviso Legal"
                icon={<Scale className="w-8 h-8" />}
            />

            <div className="space-y-6">
                <LegalSection title="1. Datos Identificativos">
                    <p>En cumplimiento con el deber de información recogido en la normativa vigente, se facilitan los siguientes datos:</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <ul className="space-y-2 text-sm text-blue-900">
                            <li><strong>Titular:</strong> Multiprecios Diego</li>
                            <li><strong>Domicilio Social:</strong> Calle Ronda 67, Puerto Serrano (Cádiz)</li>
                            <li><strong>Email de contacto:</strong> multipreciosdiego@gmail.com</li>
                            <li><strong>Actividad:</strong> Comercio al por menor</li>
                        </ul>
                    </div>
                </LegalSection>

                <LegalSection title="2. Propiedad Intelectual">
                    <p>
                        Todos los contenidos del sitio web (incluyendo textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente)
                        son propiedad de <strong>Multiprecios Diego</strong> o de terceros que han autorizado su inclusión en el sitio web.
                        Está prohibida su reproducción, distribución, comunicación pública y transformación sin autorización expresa.
                    </p>
                </LegalSection>

                <LegalSection title="3. Exclusión de Responsabilidad">
                    <p>
                        Multiprecios Diego no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar,
                        a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos
                        o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}

export function Terms() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title="Términos y Condiciones"
                icon={<FileText className="w-8 h-8" />}
                lastUpdated={new Date().toLocaleDateString()}
            />

            <div className="space-y-6">
                <LegalSection title="1. Objeto y Ámbito">
                    <p>
                        Las presentes Condiciones Generales de Contratación regulan la relación comercial entre <strong>Multiprecios Diego</strong> y el usuario
                        por la adquisición de productos a través de este sitio web. La aceptación de estas condiciones es requisito indispensable para realizar cualquier compra.
                    </p>
                </LegalSection>

                <LegalSection title="2. Precios y Pagos">
                    <p className="mb-4">
                        Los precios publicados en la web son en Euros (€) e incluyen el <strong>Impuesto sobre el Valor Añadido (IVA)</strong> aplicable en cada momento.
                    </p>
                    <p>
                        Multiprecios Diego se reserva el derecho a modificar precios, artículos, ofertas y otras condiciones comerciales sin previo aviso.
                    </p>
                </LegalSection>

                <LegalSection title="3. Envíos y Entregas">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>Los envíos se realizan a través de empresas de mensajería urgente.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>El plazo de entrega habitual es de <strong>24 a 72 horas laborables</strong> en la península.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>Los gastos de envío se calculan automáticamente antes de finalizar el pedido.</span>
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title="4. Devoluciones y Garantía">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Derecho de Desistimiento</h4>
                        <p className="text-sm text-orange-800">
                            Dispone de un plazo de <strong>14 días naturales</strong> desde la recepción del pedido para realizar devoluciones sin necesidad de justificación,
                            siempre que el producto esté en perfecto estado y en su embalaje original.
                        </p>
                    </div>
                    <p>
                        Todos nuestros productos cuentan con la garantía legal de conformidad vigente. Si recibe un producto defectuoso, nos encargaremos de la reparación,
                        sustitución o devolución sin coste alguno para usted.
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}
