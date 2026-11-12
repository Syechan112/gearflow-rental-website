import { db } from '../local/db';
import { generateId } from '@/utils/generateId';

export const auditRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.audit_logs.where('business_id').equals(businessId).reverse().sortBy('createdAt');
    }
    return await db.audit_logs.reverse().sortBy('createdAt');
  },

  async log(userId, action, details, businessId = 'biz-apex') {
    const entry = {
      id: generateId('log'),
      business_id: businessId,
      user_id: userId || 'system',
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    await db.audit_logs.add(entry);
    return entry;
  },
};
