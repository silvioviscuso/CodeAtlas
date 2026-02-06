# CodeAtlas - AI-Powered Code Review SaaS

CodeAtlas is a comprehensive AI-powered code review platform that helps development teams improve code quality through automated reviews, GitHub integration, and insightful analytics.

## 🚀 Features

### Backend API
- **Multi-tenant Architecture**: Secure tenant isolation for enterprise use
- **AI Review Engine**: Provider-agnostic AI reviews with structured outputs
- **GitHub Integration**: Webhooks, PR comments, and automated reviews
- **Authentication**: JWT + GitHub OAuth
- **Production Ready**: Comprehensive error handling, logging, and monitoring

### Mobile App
- **React Native**: iOS and Android support with Expo
- **Feature-Based Architecture**: Clean, scalable code organization
- **Redux Toolkit**: Centralized state management with TypeScript
- **Onboarding & Tour**: Guided first-time user experience
- **Offline Support**: State persistence with AsyncStorage

### Key Capabilities
- **Code Quality Analysis**: Readability, security, performance, maintainability
- **Automated Reviews**: Trigger reviews on PR creation and updates
- **GitHub Integration**: Seamless integration with existing workflows
- **Multi-Provider AI**: Support for OpenAI and Anthropic models
- **Real-time Feedback**: Instant review results and suggestions

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
```
backend/
├── src/
│   ├── api/           # REST API endpoints
│   ├── services/      # Business logic
│   ├── auth/          # Authentication handlers
│   ├── middleware/    # Express middleware
│   ├── config/        # Configuration
│   ├── types/         # TypeScript interfaces
│   ├── core/          # Core business logic
│   │   ├── auth/      # Auth service
│   │   ├── github/    # GitHub integration
│   │   ├── reviews/   # Review service
│   │   └── tenants/   # Tenant management
│   ├── infra/         # Infrastructure
│   │   └── db/        # Database layer
│   └── ai/            # AI engine
│       ├── providers/ # OpenAI/Anthropic
│       └── prompts/   # AI prompts
```

### Mobile App (React Native + Expo)
```
mobile/
├── src/
│   ├── features/      # Feature-based modules
│   │   ├── auth/      # Authentication
│   │   ├── repos/     # Repository management
│   │   ├── reviews/   # Review functionality
│   │   ├── onboarding/# Onboarding flow
│   │   └── settings/  # User settings
│   ├── api/           # API client
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom hooks
│   ├── navigation/    # App navigation
│   ├── store/         # Redux store
│   │   └── slices/    # Redux slices
│   ├── theme/         # App theming
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **AI Providers**: OpenAI, Anthropic
- **Authentication**: JWT, GitHub OAuth
- **Logging**: Winston
- **Testing**: Jest
- **Linting**: ESLint + TypeScript ESLint

### Mobile App
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: Expo Router
- **HTTP Client**: Axios
- **Async Storage**: @react-native-async-storage/async-storage
- **Testing**: Jest + React Native Testing Library
- **Linting**: ESLint + TypeScript ESLint

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Render (Backend), Expo EAS (Mobile)
- **Monitoring**: Sentry (Error tracking)
- **Code Quality**: ESLint, Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git
- Expo CLI (for mobile development)

### Backend Setup

1. **Clone and Install**
```bash
git clone https://github.com/your-org/CodeAtlas.git
cd CodeAtlas/backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
npm run db:generate
npm run db:migrate
```

4. **Start Development Server**
```bash
npm run dev
```

### Mobile App Setup

1. **Install Dependencies**
```bash
cd CodeAtlas/mobile
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your API configuration
```

3. **Start Development**
```bash
npm start
# Follow Expo CLI instructions to run on device/simulator
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codeatlas"

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Providers
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Mobile (.env)
```bash
# API Configuration
API_URL=http://localhost:3000
API_VERSION=v1

# Development
EXPO_PUBLIC_ENV=development
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

### Repository Endpoints
- `GET /api/v1/repos/:tenantId` - Get repositories
- `POST /api/v1/repos` - Create repository
- `GET /api/v1/repos/:id` - Get repository details

### Review Endpoints
- `POST /api/v1/reviews/:prId` - Create review
- `GET /api/v1/reviews/:prId` - Get review results
- `GET /api/v1/reviews` - List reviews

### GitHub Integration
- `POST /api/v1/github/webhook` - GitHub webhook receiver
- `GET /api/v1/github/installations` - Get GitHub installations

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Mobile Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Backend Deployment

#### Using Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables
4. Configure database connection
5. Deploy!

#### Using Docker
```bash
# Build image
docker build -t codeatlas-backend .

# Run container
docker run -p 3000:3000 codeatlas-backend
```

### Mobile App Deployment

#### Using Expo EAS
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure project: `eas configure`
3. Build app: `eas build --platform all`
4. Submit to stores: `eas submit --platform all`

## 🔍 Development Workflow

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Git Workflow
1. Create feature branch from `develop`
2. Make changes with descriptive commits
3. Push to remote and create PR
4. PR must pass CI/CD checks
5. Merge to `develop` for staging, `main` for production

### Testing Strategy
- Unit tests for all business logic
- Integration tests for API endpoints
- Component tests for mobile UI
- Snapshot tests for critical components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the AI models
- [Anthropic](https://anthropic.com) for Claude models
- [Expo](https://expo.dev) for React Native development
- [Redux Toolkit](https://redux-toolkit.js.org) for state management

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email us at support@codeatlas.com

---

**CodeAtlas** - Making code review faster, smarter, and more accessible for every development team.