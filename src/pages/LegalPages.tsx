import { Shield, FileText, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                    {t('legal.privacy.lastUpdated')}: <span className="font-medium text-gray-900">{lastUpdated}</span>
                </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mt-6 rounded-full"></div>
        </div>
    );
}

export function PrivacyPolicy() {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title={t('legal.privacy.title')}
                icon={<Shield className="w-8 h-8" />}
                lastUpdated={new Date().toLocaleDateString()}
            />

            <div className="space-y-6">
                <LegalSection title={t('legal.privacy.sections.responsible.title')}>
                    <p>
                        {t('legal.privacy.sections.responsible.text')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.privacy.sections.purpose.title')}>
                    <p className="mb-4">{t('legal.privacy.sections.purpose.text')}</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.privacy.sections.purpose.list.1')}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.privacy.sections.purpose.list.2')}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.privacy.sections.purpose.list.3')}</span>
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title={t('legal.privacy.sections.legitimation.title')}>
                    <p>
                        {t('legal.privacy.sections.legitimation.text')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.privacy.sections.recipients.title')}>
                    <p>
                        {t('legal.privacy.sections.recipients.text')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.privacy.sections.rights.title')}>
                    <p className="mb-4">{t('legal.privacy.sections.rights.text')}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-900 block mb-1">{t('legal.privacy.sections.rights.access.title')}</span>
                            <span className="text-sm">{t('legal.privacy.sections.rights.access.text')}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-900 block mb-1">{t('legal.privacy.sections.rights.deletion.title')}</span>
                            <span className="text-sm">{t('legal.privacy.sections.rights.deletion.text')}</span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        {t('legal.privacy.sections.rights.contact')} <a href="mailto:multipreciosdiego@gmail.com" className="text-blue-600 hover:underline">multipreciosdiego@gmail.com</a>
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}

export function LegalNotice() {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title={t('legal.notice.title')}
                icon={<Scale className="w-8 h-8" />}
            />

            <div className="space-y-6">
                <LegalSection title={t('legal.notice.sections.id.title')}>
                    <p>{t('legal.notice.sections.id.text')}</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <ul className="space-y-2 text-sm text-blue-900">
                            <li><strong>{t('legal.notice.sections.id.holder')}:</strong> Multiprecios Diego</li>
                            <li><strong>{t('legal.notice.sections.id.address')}:</strong> Calle Ronda 67, Puerto Serrano (Cádiz)</li>
                            <li><strong>{t('legal.notice.sections.id.email')}:</strong> multipreciosdiego@gmail.com</li>
                            <li><strong>{t('legal.notice.sections.id.activity')}:</strong> Comercio al por menor</li>
                        </ul>
                    </div>
                </LegalSection>

                <LegalSection title={t('legal.notice.sections.ip.title')}>
                    <p>
                        {t('legal.notice.sections.ip.text')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.notice.sections.liability.title')}>
                    <p>
                        {t('legal.notice.sections.liability.text')}
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}

export function Terms() {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <LegalHeader
                title={t('legal.terms.title')}
                icon={<FileText className="w-8 h-8" />}
                lastUpdated={new Date().toLocaleDateString()}
            />

            <div className="space-y-6">
                <LegalSection title={t('legal.terms.sections.object.title')}>
                    <p>
                        {t('legal.terms.sections.object.text')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.terms.sections.prices.title')}>
                    <p className="mb-4">
                        {t('legal.terms.sections.prices.text1')}
                    </p>
                    <p>
                        {t('legal.terms.sections.prices.text2')}
                    </p>
                </LegalSection>

                <LegalSection title={t('legal.terms.sections.shipping.title')}>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.terms.sections.shipping.list.1')}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.terms.sections.shipping.list.2')}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span>{t('legal.terms.sections.shipping.list.3')}</span>
                        </li>
                    </ul>
                </LegalSection>

                <LegalSection title={t('legal.terms.sections.returns.title')}>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                        <h4 className="font-semibold text-orange-900 mb-2">{t('legal.terms.sections.returns.withdrawal.title')}</h4>
                        <p className="text-sm text-orange-800">
                            {t('legal.terms.sections.returns.withdrawal.text')}
                        </p>
                    </div>
                    <p>
                        {t('legal.terms.sections.returns.text')}
                    </p>
                </LegalSection>
            </div>
        </div>
    );
}
