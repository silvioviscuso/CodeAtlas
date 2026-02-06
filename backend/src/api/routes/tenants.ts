/**
 * Tenant routes
 * Multi-tenant management endpoints
 */

import { Router, Request, Response } from 'express';
import { tenantService } from '../../core/tenants/tenantService';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get current tenant
router.get('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.getTenantById(req.context!.tenantId!);
    res.json({ tenant });
  } catch (error) {
    throw error;
  }
});

// Update tenant settings (admin only)
router.patch('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const updates = req.body; // Would validate with Zod in production
    const tenant = await tenantService.updateTenant(
      req.context!.tenantId!,
      updates
    );
    res.json({ tenant });
  } catch (error) {
    throw error;
  }
});

export default router;
