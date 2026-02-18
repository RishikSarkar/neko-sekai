# Neko Sekai

A virtual pet game built with Next.js 14.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Run tests, then build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Testing

Tests use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react). Includes snapshot tests for UI regression. Tests run automatically before `npm run build`.

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

## Internationalization (i18n)

Uses [next-intl](https://next-intl-docs.vercel.app/) for translations. Messages live in `messages/en.json`. To add a new locale (e.g. `ja`):

1. Create `messages/ja.json`
2. Update `i18n/request.js` to support locale selection (e.g. from cookie or path)

## Linting

ESLint runs during `next build`. Strict rules enabled in `.eslintrc.json` (no-console, eqeqeq, prefer-const, etc.).

## Agentic Development

See [.cursor/AGENTS.md](.cursor/AGENTS.md) for vibecoding best practices and conventions.

## Environment

Copy `.env.example` to `.env.local` and add your Firebase config for auth/Firestore support.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Firebase
- next-intl (i18n)
- Vitest + React Testing Library
