# Bootstrap Platform Foundation - Design

## Architecture Overview

### Monorepo Structure
```
decolonia-office/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── config/       # Shared configuration
├── docs/
│   └── adr/          # Architecture decisions
├── openspec/         # OpenSpec artifacts
├── docker-compose.yml
└── package.json (root)
```

### Technology Stack

- **Monorepo**: pnpm workspaces + Turbo
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL 16 (Docker)
- **Object Storage**: MinIO S3-compatible (Docker)
- **Package Manager**: pnpm 9

### Development Workflow

```
┌─────────────────────────────────────────┐
│  Developer runs: pnpm dev               │
├─────────────────────────────────────────┤
│  1. Start infrastructure (Docker)       │
│     - PostgreSQL on :5433               │
│     - MinIO on :9000/:9001              │
├─────────────────────────────────────────┤
│  2. Start applications (Turbo parallel) │
│     - Web on :3000                      │
│     - API on :3001                      │
├─────────────────────────────────────────┤
│  3. Run connectivity verification       │
│     - API → PostgreSQL ✓                │
│     - API → MinIO ✓                     │
│     - Web → API ✓                       │
└─────────────────────────────────────────┘
```

### Health and Connectivity Endpoints

- `GET /health` - API basic health
- `GET /health/connectivity` - Full infrastructure connectivity report
- `pnpm verify:connectivity` - Script-based validation from web and API

## Environment Configuration

Local development uses predictable defaults:
- Database: `postgresql://decolonia:decolonia@localhost:5433/decolonia_office`
- Object Storage: `http://localhost:9000` (admin: minioadmin/minioadmin)
- API Base: `http://localhost:3001`

Environment files:
- `.env` (root shared defaults)
- `apps/api/.env` (API-specific)
- `apps/web/.env.local` (Web-specific)
