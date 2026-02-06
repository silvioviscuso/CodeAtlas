/**
 * Tenant service
 * Multi-tenant management and operations
 */

import prisma from '../../infra/db/prismaClient';
import { createError } from '../../api/middleware/errorHandler';

class TenantService {
  /**
   * Get tenant by ID
   */
  async getTenantById(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!tenant) {
      throw createError('Tenant not found', 404);
    }

    return tenant;
  }

  /**
   * Update tenant settings
   */
  async updateTenant(tenantId: string, updates: { name?: string; plan?: string }) {
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updates,
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        updatedAt: true,
      },
    });

    return tenant;
  }

  /**
   * Get tenant repositories
   */
  async getRepositories(tenantId: string) {
    return prisma.repository.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const tenantService = new TenantService();
