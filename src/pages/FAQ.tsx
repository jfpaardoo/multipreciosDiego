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
                <h1 className="text-3xl font-bold">{t('faq.title')}</h1>
                <p className="text-gray-500">{t('faq.subtitle')}</p>
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
                <h2 className="text-xl font-bold">{t('faq.notFoundTitle')}</h2>
                <p className="text-gray-600">
                    {t('faq.notFoundText')}
                </p>
                <Button onClick={() => navigate('/issues')} size="lg">
                    {t('faq.openIssue')}
                </Button>
            </div>
        </div>
    );
}
