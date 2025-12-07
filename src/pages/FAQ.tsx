import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FAQ() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const faqs = [
        {
            question: t('faq.questions.q1'),
            answer: t('faq.questions.a1')
        },
        {
            question: t('faq.questions.q2'),
            answer: t('faq.questions.a2')
        },
        {
            question: t('faq.questions.q3'),
            answer: t('faq.questions.a3')
        },
        {
            question: t('faq.questions.q4'),
            answer: t('faq.questions.a4')
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('faq.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('faq.subtitle')}</p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                            <HelpCircle className="h-5 w-5 text-blue-500" />
                            {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 ml-7">{faq.answer}</p>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center space-y-4 border border-blue-100 dark:border-blue-800">
                <AlertCircle className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('faq.notFoundTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('faq.notFoundText')}
                </p>
                <Button onClick={() => navigate('/issues')} size="lg">
                    {t('faq.openIssue')}
                </Button>
            </div>
        </div>
    );
}
