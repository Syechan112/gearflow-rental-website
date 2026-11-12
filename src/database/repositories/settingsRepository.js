import { db } from '../local/db';

export const settingsRepository = {
  async getSettings(businessId = 'biz-apex') {
    const record = await db.business_settings.get(businessId);
    if (record) return record;
    return {
      id: businessId,
      business_id: businessId,
      late_fee_percentage: 50,
      grace_period_hours: 2,
      deposit_policy: 'Wajib KTP asli + Deposit tunai/transfer',
      cancellation_policy: 'Gratis pembatalan H-1 sebelum sewa dimulai',
      opening_hours: '08:00 - 21:00 WIB',
    };
  },

  async updateSettings(businessId, updates) {
    const existing = await db.business_settings.get(businessId);
    if (existing) {
      await db.business_settings.update(businessId, { ...updates, updatedAt: new Date().toISOString() });
    } else {
      await db.business_settings.add({ id: businessId, business_id: businessId, ...updates, updatedAt: new Date().toISOString() });
    }
    return await this.getSettings(businessId);
  },
};
