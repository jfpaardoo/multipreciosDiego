import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage, getChatbotResponse, generateMessageId } from '../utils/chatbot-utils';

export function Chatbot() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: ChatMessage = {
                id: generateMessageId(),
                text: t('chatbot.welcome'),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length, t]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: generateMessageId(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Get bot response
        setTimeout(() => {
            const response = getChatbotResponse(inputValue, t);
            const botMessage: ChatMessage = {
                id: generateMessageId(),
                text: response.text,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

            // Add suggestions if any
            if (response.suggestions && response.suggestions.length > 0) {
                const suggestionsMessage: ChatMessage = {
                    id: generateMessageId(),
                    text: '__SUGGESTIONS__', // Special marker for suggestions
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, suggestionsMessage]);
            }
        }, 500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        handleSendMessage();
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Chat Button */}
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
                    aria-label={t('chatbot.openChat')}
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="hidden sm:inline font-medium">{t('chatbot.needHelp')}</span>
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-2xl w-[380px] h-[500px] flex flex-col transition-all duration-300">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <div>
                                <h3 className="font-bold">{t('chatbot.title')}</h3>
                                <p className="text-xs opacity-90">{t('chatbot.subtitle')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-green-700 p-1 rounded transition-colors"
                            aria-label={t('chatbot.close')}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                        {messages.map((message) => {
                            if (message.text === '__SUGGESTIONS__') {
                                const response = getChatbotResponse(messages[messages.indexOf(message) - 2]?.text || '', t);
                                return (
                                    <div key={message.id} className="flex flex-wrap gap-2">
                                        {response.suggestions?.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="text-xs bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] p-3 rounded-lg ${message.sender === 'user'
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-700 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={t('chatbot.placeholder')}
                                className="flex-1 p-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                                aria-label={t('chatbot.send')}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
