# AI Changelog

## 2026-10-05

### #JANUS-MS-USERS-0004: Persist Authenticated User Provider Links

**Work**: Plan / Build; Extended the User domain create flow for Better Auth-backed provisioning while retaining User persistence and uniqueness ownership in `ms-users`.

- Accepted the BFF-provided internal User `id`, provider login data, profile fields, and metadata through validated create DTOs.
- Persisted AuthLogin timestamps and nullable provider fields with the User document and exposed AuthLogin data in the response contract.
- Added a unique AuthLogin index and translated MongoDB duplicate-key failures into HTTP `409 Conflict` responses for deterministic provisioning behavior.
- Synchronized the service defaults and environment example with port `4001` and database `ms-users-db`.

## 2026-10-05

### #JANUS-MS-USERS-0003: Document Users Microservice Usage

**Work**: Build; Replaced the NestJS starter README with repository-specific documentation for the User domain service, REST API, MongoDB configuration, source organization, and development workflow.

- Documented User CRUD routes, collection query parameters, Swagger endpoints, and environment configuration.
- Documented the service-owned User persistence boundary and the separation from Better Auth JWT validation.
- Documented the feature-first source structure, testing commands, and contribution boundaries.

## 2026-10-05

### #JANUS-MS-USERS-0002: Implement Initial Users Microservice

**Work**: Plan / Build; Implemented the initial User domain REST service with MongoDB persistence, validated DTO boundaries, Swagger documentation, and Jest coverage without adding authentication responsibilities to `ms-users`.

- Added feature-first Users architecture with controller, service, repository, DTO, schema, and domain type layers.
- Implemented User creation, collection filtering and pagination, retrieval, profile update, and deletion endpoints required by the BFF downstream contract.
- Added Mongoose persistence with User contract fields, generated internal/public identifiers, timestamps, uniqueness constraints, and query indexes.
- Added environment-based MongoDB and port configuration with `.env.example`; removed Better Auth/JWT configuration from the microservice boundary.
- Added Swagger/OpenAPI documentation and global DTO validation/transformation.
- Added Jest unit coverage and MongoDB Memory Server e2e coverage for CRUD, validation, filtering, deletion, and API documentation.

## 2026-10-05

### #JANUS-MS-USERS-0001: Configure Backend Project Tooling

**Work**: Plan / Build; Adapted the applicable NestJS backend development tooling from the BFF while preserving the clean Jest-based project baseline.

- Configured ESLint, Prettier, Husky, Conventional Commits, Commitizen, and semantic-release.
- Added the applicable project scripts, ignore rules, and changelog conventions.
- Preserved Jest as the test runner and did not introduce Vitest or `@nestjs/mau`.
- Preserved the clean application dependency baseline without introducing domain or application features.
