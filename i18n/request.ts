import { getRequestConfig } from 'next-intl/server';
import { unstable_cache } from 'next/cache';

const getCachedMessages = unstable_cache(
  async () => (await import('../messages/en.json')).default,
  ['i18n-messages-en'],
  { revalidate: 3600 }
);

export default getRequestConfig(async () => {
  const locale = 'en';
  const messages = await getCachedMessages();
  return {
    locale,
    messages,
  };
});
