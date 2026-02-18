'use client';

import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error: _error, reset }: ErrorProps) {
  const t = useTranslations('error');
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-bold mb-4">{t('title')}</h2>
      <p className="text-white/80 mb-6 max-w-md">{t('message')}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-white text-black rounded-xl hover:bg-white/80 transition-colors"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}
