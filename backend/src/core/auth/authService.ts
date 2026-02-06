/**
 * Authentication service
 * Handles GitHub OAuth and JWT token generation
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../infra/db/prismaClient';
import env from '../../config/env';
import { logger } from '../../config/logger';
import { createError } from '../../api/middleware/errorHandler';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    githubUsername: string | null;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

class AuthService {
  /**
   * Handle GitHub OAuth callback
   * Exchange code for access token, fetch user info, create/update user
   */
  async handleGitHubCallback(code: string): Promise<AuthResult> {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw createError('Failed to obtain GitHub access token', 401);
      }

      // Fetch GitHub user info
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const githubUser = userResponse.data;

      // Find or create user and tenant
      let user = await prisma.user.findUnique({
        where: { githubUserId: String(githubUser.id) },
        include: { tenant: true },
      });

      if (!user) {
        // Create new tenant and user
        const tenant = await prisma.tenant.create({
          data: {
            name: githubUser.login || 'Personal',
            slug: this.generateSlug(githubUser.login || 'user'),
          },
        });

        user = await prisma.user.create({
          data: {
            email: githubUser.email || `${githubUser.login}@users.noreply.github.com`,
            name: githubUser.name || githubUser.login,
            githubUserId: String(githubUser.id),
            githubUsername: githubUser.login,
            avatarUrl: githubUser.avatar_url,
            tenantId: tenant.id,
            role: 'owner',
          },
          include: { tenant: true },
        });
      } else {
        // Update user info
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: githubUser.name || user.name,
            githubUsername: githubUser.login,
            avatarUrl: githubUser.avatar_url,
          },
          include: { tenant: true },
        });
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          githubUsername: user.githubUsername,
        },
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
        },
      };
    } catch (error: any) {
      logger.error('GitHub OAuth callback failed', { error: error.message });
      throw createError('Authentication failed', 401, 'AUTH_ERROR');
    }
  }

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      githubUsername: user.githubUsername,
      avatarUrl: user.avatarUrl,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
      },
    };
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(user: { id: string; email: string; tenantId: string; githubUserId: string | null }): string {
    return jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        email: user.email,
        githubUserId: user.githubUserId,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Generate URL-friendly slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const authService = new AuthService();
