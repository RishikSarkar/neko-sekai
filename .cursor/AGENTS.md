# Agentic Prompting Guide (Vibecoding Best Practices)

This document defines conventions for AI-assisted development ("vibecoding") on this project. Follow these guidelines to maintain consistency and quality.

## General Principles

### Code Quality
- **Keep code clean.** Prefer small, focused functions. Avoid deep nesting. Extract reusable logic into hooks or utilities.
- **Remove obsolete code.** Delete commented-out code, unused imports, and dead functions. Do not leave "TODO" or "FIXME" indefinitely.
- **Remove obsolete dependencies.** Run `npm ls` and remove packages that are no longer used. Update `package.json` and lockfile.

### Comments
- **Comment when necessary.** Explain *why*, not *what*. Document non-obvious business logic, workarounds, and edge cases.
- **Avoid redundant comments.** Do not repeat what the code clearly expresses.
- **Use JSDoc for public APIs** when exposing modules or complex functions.

### Documentation
- **Do NOT use emojis in READMEs or docs.** Use plain text. Emojis can cause encoding issues, accessibility problems, and inconsistent rendering across tools.
- **Keep README concise.** Focus on setup, scripts, and essential info. Link to detailed docs when needed.
- **Update docs with code changes.** When adding features or changing behavior, update the relevant documentation.

### Testing
- **Always add tests for new code.** Every new component, hook, or utility should have corresponding tests.
- **Always add snapshots for UI components.** Use `toMatchSnapshot()` for TopBar, BottomBar, Shop, Customize, Pet, pages, and error boundaries.
- **Tests run before build.** Ensure `npm run test` passes. Fix or update snapshots when behavior intentionally changes.
- **Mock external dependencies.** Mock next/image, next/dynamic, next-intl, Firebase, and localStorage in tests.

### Linting
- **Strict linting is enabled.** Fix all ESLint errors. Warnings should be addressed or explicitly disabled with justification.
- **No console.log in production paths.** Use `console.warn` or `console.error` for diagnostics. Remove debug logs before merging.

### Dependencies
- **Minimize dependencies.** Prefer built-in APIs and native browser features. Evaluate bundle size impact.
- **Pin versions when necessary.** Use exact versions for critical packages if lockfile drift causes issues.
- **Audit regularly.** Run `npm audit` and address vulnerabilities appropriately.

### File Conventions
- **Use .jsx for files containing JSX.** Enables proper parsing in tools (ESLint, Vitest, IDEs).
- **Prefer named exports for components** when they need display names or re-export flexibility.

### Git & Commits
- **Keep commits atomic.** One logical change per commit. Easier to review and revert.
- **Write clear commit messages.** Use imperative mood. Describe the change, not the process.

### Internationalization (i18n)
- **Use translation keys for user-facing text.** Add new strings to `messages/en.json`. Do not hardcode copy in components.
- **Use the `common` namespace** for shared UI labels. Create feature-specific namespaces for larger sections.

### Accessibility
- **Provide alt text for images.** Use meaningful text or empty string for decorative images.
- **Use semantic HTML.** Prefer buttons for actions, proper headings, and ARIA when needed.

## Checklist for New Features

- [ ] Code is clean and follows existing patterns
- [ ] No obsolete code or commented-out blocks
- [ ] Comments added for non-obvious logic
- [ ] Unit tests added
- [ ] Snapshot tests added for UI
- [ ] User-facing strings added to i18n messages
- [ ] ESLint passes
- [ ] All tests pass
- [ ] README/docs updated if user-facing
