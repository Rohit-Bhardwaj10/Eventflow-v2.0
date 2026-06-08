# Eventflow v2.0

Eventflow is a modern, full-stack university club and event management platform. It allows colleges to manage clubs, events, registrations, check-ins, and analytics in a streamlined way.

## Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) framework
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Caching & Auth:** Redis
- **Frontend:** [Next.js](https://nextjs.org/) (React)

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **Docker & Docker Compose** (for running local PostgreSQL and Redis instances)
- **pnpm** or **npm**

## Getting Started

### 1. Infrastructure
First, start the local database and cache using Docker Compose:
```bash
docker-compose up -d
```
*Note: The PostgreSQL instance is configured to use port `5433` and Redis uses port `6380` to avoid conflicts with existing services.*

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and run database migrations:
```bash
cd backend
npm install
npx prisma db push
```

Start the backend development server:
```bash
npm run start:dev
```
The API will be available at `http://localhost:3001/api/v1`.

### 3. Frontend Setup
*(Frontend setup instructions will go here once the frontend is fully scaffolded)*
```bash
cd frontend
npm install
npm run dev
```

