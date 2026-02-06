/**
 * Token service (for future token revocation/refresh)
 * Currently a placeholder for future enhancements
 */

import jwt from 'jsonwebtoken';
import env from '../../config/env';

export interface TokenPayload {
  userId: string;
  tenantId: string;
  email: string;
  githubUserId?: string;
}

class TokenService {
  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService();
