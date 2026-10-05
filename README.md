# Janus Journey Users Microservice

`ms-users` is the Janus Journey domain microservice responsible for the User
domain and its persistence.

It exposes a REST API consumed by the Janus Journey BFF and stores User data in
MongoDB through Mongoose. The service owns User DTO validation, User CRUD
operations, and User persistence.

## Users service status

The current service includes:

- NestJS REST API for User CRUD.
- MongoDB persistence through Mongoose.
- Generated internal and public User identifiers.
- User profile configuration with username and avatar URL support.
- User collection filtering, pagination, and sorting.
- Request DTO validation and transformation.
- Swagger/OpenAPI documentation at `/docs` and `/docs-json`.
- Jest unit tests and MongoDB Memory Server e2e tests.

The current phase intentionally does **not** include:

- Better Auth JWT validation.
- Better Auth session management or token issuance.
- Journey, Folder, Task, or Feature Flag domain logic.
- Direct access to another microservice’s database.
- Public client access that bypasses the BFF architecture.

## Architecture and responsibility

```text
Janus clients
    │
    ▼
NestJS BFF :5000
    │
    ▼
ms-users :4001
    │
    ├── User REST controller
    ├── User application service
    ├── User repository
    └── Mongoose User model
            │
            ▼
      MongoDB
```

The service follows:

```text
Controller → Application/Domain Service → Persistence
```

The BFF owns client authentication and JWT validation. `ms-users` does not
validate JWTs. The BFF forwards the validated identity as the internal
`x-authenticated-subject` header when calling this service.

## User API

| Method   | Route        | Description                                         |
| -------- | ------------ | --------------------------------------------------- |
| `POST`   | `/users`     | Create a User.                                      |
| `GET`    | `/users`     | List Users with filtering, pagination, and sorting. |
| `GET`    | `/users/:id` | Retrieve a User by internal resource ID.            |
| `PATCH`  | `/users/:id` | Update permitted User profile fields.               |
| `DELETE` | `/users/:id` | Delete a User.                                      |

### User collection queries

`GET /users` supports the following initial query parameters:

- `email`
- `userId`
- `username`
- `isVerified`
- `page`
- `limit`
- `sortBy`: `createdAt`, `updatedAt`, `userId`, or `email`
- `sortOrder`: `asc` or `desc`

Malformed query values are rejected by DTO validation before reaching the
repository.

## Technology stack

The service uses:

- **Node.js**
- **NestJS**
- **TypeScript** with strict checking
- **REST**
- **MongoDB**
- **Mongoose** through `@nestjs/mongoose`
- **Swagger/OpenAPI**
- **class-validator** and **class-transformer**
- **Jest**, **Supertest**, and **MongoDB Memory Server** for tests
- **ESLint**, **Oxlint**, and **Prettier** for code quality

## Requirements

Before installing the project, make sure the following tools are available:

- Node.js 22 or a compatible current Node.js release.
- npm.
- MongoDB for local development, or a compatible MongoDB connection string.

## Installation

```bash
git clone <repository-url>
cd janus-journey-ms-users
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the service:

```dotenv
PORT=4001
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE_NAME=janus_journey
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
```

Do not commit `.env` or real credentials.

## Development

Start MongoDB, then start the service:

```bash
npm run start:dev
```

The service is available at:

- API: [http://localhost:4001](http://localhost:4001)
- Swagger UI: [http://localhost:4001/docs](http://localhost:4001/docs)
- OpenAPI JSON: [http://localhost:4001/docs-json](http://localhost:4001/docs-json)

## Source structure

```text
src/
├── config/                 # Environment and Swagger configuration
└── users/                  # User feature boundary
    ├── controllers/        # REST transport layer
    ├── dto/                # Request and response contracts
    ├── repositories/       # Mongoose persistence access
    ├── schemas/            # MongoDB document schemas
    ├── services/           # User application/domain operations
    └── types/              # User domain types
```

The source is organized by feature first and technical responsibility second.

## Useful commands

```bash
# Run the development server
npm run start:dev

# Run ESLint
npm run lint

# Run Oxlint
npm run lint:oxlint

# Run unit tests
npm run test

# Run MongoDB-backed e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Check formatting
npm run prettier:check

# Format the repository
npm run prettier:fix

# Create a production build
npm run build

# Start the production server after building
npm run start:prod
```

## Contribution guidelines

When extending `ms-users`:

- Keep User domain ownership and persistence inside this service.
- Keep controllers thin and use the service/repository flow.
- Validate and transform transport data with DTOs.
- Do not add JWT validation or Better Auth session logic.
- Do not add Journey, Folder, Task, or Feature Flag behavior.
- Do not connect directly to another service’s database.
- Keep required environment variables synchronized with `.env.example`.
- Prefer existing dependencies and established project conventions.

Meaningful completed changes are recorded in [`AIChangelog.md`](./AIChangelog.md).
