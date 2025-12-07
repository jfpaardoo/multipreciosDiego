import { Star, MapPin, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const REVIEWS = [
    {
        author: "Adrián Muñoz Aradilla",
        rating: 5,
        text: "Atención al cliente 10/10. Muy recomendable. Volveré a hacer mis compras allí",
        initial: "A"
    },
    {
        author: "Juan Felipe Pardo",
        rating: 5,
        text: "El dependiente fue muy amable cuando buscaba el producto. Volveré a ir",
        initial: "J"
    },
    {
        author: "MANUEL DIAZ CASTILLO",
        rating: 5,
        text: "Buena gente y buen profesional",
        initial: "M"
    }
];

export function ReviewsSection() {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-white dark:bg-gray-800 rounded-3xl my-12 relative overflow-hidden border dark:border-gray-700">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {t('reviews.title')}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-yellow-500">
                        <Star className="w-6 h-6 fill-current" />
                        <Star className="w-6 h-6 fill-current" />
                        <Star className="w-6 h-6 fill-current" />
                        <Star className="w-6 h-6 fill-current" />
                        <Star className="w-6 h-6 fill-current" />
                        <span className="text-gray-600 dark:text-gray-400 text-lg font-medium ml-2 text-black dark:text-white">{t('reviews.google')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col relative group"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-100 dark:text-gray-700 group-hover:text-blue-50 dark:group-hover:text-blue-900/30 transition-colors" />

                            <div className="flex items-center gap-1 text-yellow-500 mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed italic">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {review.initial}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{review.author}</h4>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{t('reviews.verified')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://maps.app.goo.gl/XB5x4FzYAsjMRrjC9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-6 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        <MapPin className="w-5 h-5 text-red-500" />
                        {t('reviews.viewAll')}
                    </a>
                </div>
            </div>
        </section>
    );
}
