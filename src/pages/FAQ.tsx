import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle, HelpCircle } from 'lucide-react';

export function FAQ() {
    const navigate = useNavigate();

    const faqs = [
        {
            question: "¿Cómo puedo realizar un pedido?",
            answer: "Navega por nuestro catálogo, añade productos al carrito y procede al pago. Puedes elegir envío a domicilio o recogida en tienda."
        },
        {
            question: "¿Cuáles son los métodos de pago aceptados?",
            answer: "Aceptamos tarjeta de crédito/débito, Bizum y pago en efectivo (solo para recogida en tienda)."
        },
        {
            question: "¿Cuánto tardan los envíos?",
            answer: "Los envíos a domicilio suelen tardar entre 24 y 48 horas laborables."
        },
        {
            question: "¿Puedo devolver un producto?",
            answer: "Sí, tienes 14 días para devolver productos en su estado original. Contacta con nosotros para iniciar el proceso."
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Preguntas Frecuentes</h1>
                <p className="text-gray-500">Resolvemos tus dudas sobre Multiprecios Diego</p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-500" />
                            {faq.question}
                        </h3>
                        <p className="text-gray-600 ml-7">{faq.answer}</p>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 p-8 rounded-lg text-center space-y-4 border border-blue-100">
                <AlertCircle className="h-12 w-12 mx-auto text-blue-500" />
                <h2 className="text-xl font-bold">¿No encuentras lo que buscas?</h2>
                <p className="text-gray-600">
                    Si tienes algún problema con un pedido o necesitas ayuda personalizada, puedes abrir una incidencia.
                </p>
                <Button onClick={() => navigate('/issues')} size="lg">
                    Abrir una Incidencia
                </Button>
            </div>
        </div>
    );
}
