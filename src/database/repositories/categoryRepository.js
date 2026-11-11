import { db } from '../local/db';

export const categoryRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.categories.where('business_id').equals(businessId).toArray();
    }
    return await db.categories.toArray();
  },

  async getById(id) {
    return await db.categories.get(id);
  },

  async create(category) {
    await db.categories.add(category);
    return category;
  },

  async update(id, updates) {
    await db.categories.update(id, updates);
    return await this.getById(id);
  },

  async delete(id) {
    return await db.categories.delete(id);
  },
};
