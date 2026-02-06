# Contributing to CodeAtlas

Thank you for your interest in contributing to CodeAtlas! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow the project's coding standards

## Development Workflow

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and patterns
   - Write or update tests as needed
   - Update documentation if necessary

3. **Run checks before committing**
   ```bash
   # Backend
   cd backend
   npm run lint
   npm run typecheck
   npm test

   # Mobile
   cd mobile
   npm run lint
   npm run typecheck
   npm test
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format when possible

5. **Push and create a Pull Request**
   - Ensure CI checks pass
   - Provide clear description of changes
   - Reference any related issues

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Document complex functions with JSDoc comments

### Backend

- Follow Express.js best practices
- Use async/await for asynchronous operations
- Handle errors explicitly with try/catch
- Use Zod for runtime validation
- Keep services focused and testable

### Mobile

- Use functional components with hooks
- Follow React Native best practices
- Use TypeScript for type safety
- Keep components small and focused
- Use React Query for data fetching

## Testing

- Write tests for new features
- Maintain or improve test coverage
- Test error cases and edge cases
- Use descriptive test names

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for public APIs
- Keep code comments focused on "why" not "what"

## Pull Request Process

1. Ensure all CI checks pass
2. Request review from maintainers
3. Address review feedback
4. Squash commits if requested
5. Wait for approval before merging

## Questions?

Open an issue for questions, bug reports, or feature requests.
