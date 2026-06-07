# co-crm-api (backend)

REST API for the **co-crm** CRM application, built with **NestJS** and **Prisma** on top of PostgreSQL.

The frontend lives in a separate repository: [`co-crm`](https://github.com/Iryna-Bigdash/co-crm).

## Tech stack

- [NestJS 10](https://nestjs.com/)
- [Prisma 5](https://www.prisma.io/) ORM
- PostgreSQL (e.g. [Neon](https://neon.tech/))
- [Multer](https://github.com/expressjs/multer) for file uploads
- [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting) for rate limiting

All routes are prefixed with `/api`. Uploaded files are served statically from `/uploads`.

## Domain model

`Company`, `Category`, `Country`, `Promotions`, `Employee`, `EmployeeCompany`, `Interaction` — see `prisma/schema.prisma`.

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# then fill in DATABASE_URL / DATABASE_URL_UNPOOLED

# 3. Generate the Prisma client and apply migrations
npx prisma generate
npx prisma migrate deploy

# 4. Run the API (port 3000)
npm run start:dev
```

The server starts on [http://localhost:3000](http://localhost:3000) (routes under `/api`).

## Environment variables

See `.env.example`. Copy it to `.env` and fill in real values:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL connection string (runtime) |
| `DATABASE_URL_UNPOOLED` | Direct PostgreSQL connection string (migrations) |
| `PORT` | Port to listen on (optional, defaults to `3000`) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Run the compiled build (`dist/main`) |
| `npm run build` | Compile the project |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Deployment

1. Provision a PostgreSQL database and set `DATABASE_URL` / `DATABASE_URL_UNPOOLED`.
2. Run `npx prisma migrate deploy` against the production database.
3. Build with `npm run build` and start with `npm run start:prod`.

> Note: the `uploads/` directory holds runtime user files and is git-ignored (only `.gitkeep` is committed). On ephemeral hosting, use external storage (e.g. S3) for persistence.
