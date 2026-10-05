# AI Changelog

## 2026-10-05

### #JANUS-MS-USERS-0001: Configure Backend Project Tooling

**Work**: Plan / Build; Adapted the applicable NestJS backend development tooling from the BFF while preserving the clean Jest-based project baseline.

- Configured ESLint, Prettier, Husky, Conventional Commits, Commitizen, and semantic-release.
- Added the applicable project scripts, ignore rules, and changelog conventions.
- Preserved Jest as the test runner and did not introduce Vitest or `@nestjs/mau`.
- Preserved the clean application dependency baseline without introducing domain or application features.