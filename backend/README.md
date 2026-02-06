# CodeAtlas Backend

Production-ready API server for CodeAtlas, an AI-powered code review assistant.

## Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with GitHub OAuth
- **AI Engine**: Pluggable provider system (OpenAI, Anthropic)
- **Multi-tenant**: Tenant isolation at the data layer

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Run migrations
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing (min 32 chars)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials
- `AI_PROVIDER`: `openai` or `anthropic`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: AI provider API key

## API Endpoints

### Health
- `GET /health` - Health check

### Authentication
- `POST /api/v1/auth/github/callback` - GitHub OAuth callback
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Tenants
- `GET /api/v1/tenants/current` - Get current tenant (requires auth)
- `PATCH /api/v1/tenants/current` - Update tenant (requires auth)

### Reviews
- `GET /api/v1/reviews` - List reviews (requires auth)
- `GET /api/v1/reviews/:id` - Get review details (requires auth)
- `POST /api/v1/reviews/trigger` - Trigger manual review (requires auth)

### GitHub Webhooks
- `POST /api/v1/github/webhook` - GitHub webhook receiver

## Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run typecheck    # Type check without building
```

## Database

```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database (if seed file exists)
```

## Project Structure

```
src/
  app.ts              # Express app setup
  server.ts           # Server entry point
  config/             # Configuration (env, logger)
  api/
    routes/           # API route handlers
    middleware/       # Express middleware
  core/
    auth/             # Authentication services
    tenants/          # Tenant management
    reviews/          # Review orchestration
    github/           # GitHub integration
  ai/
    engine.ts         # AI engine abstraction
    providers/        # AI provider implementations
    prompts/          # Structured prompts
  infra/
    db/               # Database client
```

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Ensure all environment variables are set
3. Run migrations: `npm run db:migrate`
4. Build: `npm run build`
5. Start: `npm start`

Consider using:
- Process manager (PM2, systemd)
- Reverse proxy (nginx)
- Database connection pooling
- Rate limiting at infrastructure level
- Monitoring and logging (Datadog, Sentry)
