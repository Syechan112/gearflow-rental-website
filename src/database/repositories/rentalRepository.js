import { db } from '../local/db';
import { RENTAL_STATUS } from '@/constants/statuses';

export const rentalRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.rental_orders.where('business_id').equals(businessId).toArray();
    }
    return await db.rental_orders.toArray();
  },

  async getById(id) {
    return await db.rental_orders.get(id);
  },

  async getByCustomerId(customerId) {
    return await db.rental_orders.where('customer_id').equals(customerId).toArray();
  },

  async getActiveRentals(businessId) {
    return await db.rental_orders
      .where('status')
      .equals(RENTAL_STATUS.ONGOING)
      .filter((r) => !businessId || r.business_id === businessId)
      .toArray();
  },

  async create(order) {
    await db.rental_orders.add(order);
    return order;
  },

  async updateStatus(id, status, extra = {}) {
    await db.rental_orders.update(id, { status, ...extra, updatedAt: new Date().toISOString() });
    return await this.getById(id);
  },
};
