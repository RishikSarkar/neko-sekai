import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, fill, unoptimized, ...rest } = props;
    return React.createElement('img', { src, alt, ...rest });
  },
}));

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}));

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string, values?: Record<string, number | string>) => {
    if (key === 'newTaskAtLevel' && values?.level != null) {
      return `new task at level ${values.level}!`;
    }
    const messages: Record<string, string> = {
      reset: 'Reset',
      shop: 'shop',
      feed: 'feed',
      customize: 'customize',
      tasks: 'Tasks',
      timeLeft: 'time left',
      level: 'level',
      favoriteFood: 'favorite food',
      'error.title': 'Something went wrong',
      'error.message': 'The cat got into a bit of trouble. Try refreshing the page.',
      'error.tryAgain': 'Try again',
    };
    const fullKey = ns ? `${ns}.${key}` : key;
    return messages[fullKey] ?? messages[key] ?? key;
  },
}));

vi.mock('next-intl/server', () => ({
  getMessages: () => Promise.resolve({}),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter', variable: '--font-inter' }),
  Nova_Mono: () => ({ variable: '--font-nova-mono' }),
  Nova_Square: () => ({ variable: '--font-nova-square' }),
}));
