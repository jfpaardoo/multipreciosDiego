export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface ChatbotResponse {
    text: string;
    suggestions?: string[];
}

// Pattern matching for common questions
export function getChatbotResponse(message: string, t: (key: string) => string): ChatbotResponse {
    const lowerMessage = message.toLowerCase().trim();

    // Greetings
    if (/^(hola|hello|hi|hey|buenos días|buenas tardes)/i.test(lowerMessage)) {
        return {
            text: t('chatbot.greeting'),
            suggestions: [
                t('chatbot.suggestion.orderStatus'),
                t('chatbot.suggestion.shipping'),
                t('chatbot.suggestion.returns')
            ]
        };
    }

    // Shipping questions
    if (/envío|shipping|entrega|delivery|entregar|cuánto tarda/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.shipping'),
            suggestions: [
                t('chatbot.suggestion.orderStatus'),
                t('chatbot.suggestion.shippingCost')
            ]
        };
    }

    // Payment questions
    if (/pago|payment|tarjeta|card|bizum|efectivo|cash|pagar/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.payment'),
            suggestions: [
                t('chatbot.suggestion.orderStatus')
            ]
        };
    }

    // Returns/refunds
    if (/devolución|devolver|return|refund|reembolso|cambio/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.returns'),
            suggestions: [
                t('chatbot.suggestion.howToReturn')
            ]
        };
    }

    // Order tracking
    if (/pedido|order|tracking|rastrear|seguimiento|dónde está/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.orderTracking'),
            suggestions: [
                t('chatbot.suggestion.myOrders')
            ]
        };
    }

    // Product availability
    if (/stock|disponible|available|agotado|cuándo|when/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.stock'),
            suggestions: [
                t('chatbot.suggestion.reservation')
            ]
        };
    }

    // Reservation
    if (/reserva|reservation|guardar|hold/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.reservation'),
            suggestions: [
                t('chatbot.suggestion.myReservations')
            ]
        };
    }

    // Contact
    if (/contacto|contact|email|teléfono|phone|hablar|speak/i.test(lowerMessage)) {
        return {
            text: t('chatbot.response.contact'),
            suggestions: []
        };
    }

    // Default response
    return {
        text: t('chatbot.response.default'),
        suggestions: [
            t('chatbot.suggestion.faq'),
            t('chatbot.suggestion.issues'),
            t('chatbot.suggestion.contact')
        ]
    };
}

export function generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
