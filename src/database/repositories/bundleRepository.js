import { db } from '../local/db';

export const bundleRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.equipment_bundles.where('business_id').equals(businessId).toArray();
    }
    return await db.equipment_bundles.toArray();
  },

  async getById(id) {
    return await db.equipment_bundles.get(id);
  },

  async create(bundle) {
    await db.equipment_bundles.add(bundle);
    return bundle;
  },

  async delete(id) {
    return await db.equipment_bundles.delete(id);
  },
};
