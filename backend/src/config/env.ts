/**
 * Environment configuration with validation
 * Uses Zod for runtime type safety and validation
 */

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),

  // AI Provider
  AI_PROVIDER: z.enum(['openai', 'anthropic']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4-turbo-preview'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-opus-20240229'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().int().positive()).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().int().positive()).default('100'),

  // External Services
  GITHUB_API_BASE_URL: z.string().url().default('https://api.github.com'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment configuration:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

// Validate AI provider configuration
if (env.AI_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
  console.warn('⚠️  OpenAI provider selected but OPENAI_API_KEY is not set');
}

if (env.AI_PROVIDER === 'anthropic' && !env.ANTHROPIC_API_KEY) {
  console.warn('⚠️  Anthropic provider selected but ANTHROPIC_API_KEY is not set');
}

export default env;
