import { db } from '../local/db';
import { resolveCustomerIds } from '@/utils/resolveCustomerIds';

export const customerRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.customers.where('business_id').equals(businessId).toArray();
    }
    return await db.customers.toArray();
  },

  async getById(id) {
    return await db.customers.get(id);
  },

  async create(customer) {
    await db.customers.add(customer);
    return customer;
  },

  async update(id, updates) {
    await db.customers.update(id, updates);
    return await this.getById(id);
  },

  async delete(id) {
    return await db.customers.delete(id);
  },

  async getHistory(customerId) {
    const ids = await resolveCustomerIds(customerId);
    const [bookings, rentals] = await Promise.all([
      db.bookings.where('customer_id').anyOf(ids).toArray(),
      db.rental_orders.where('customer_id').anyOf(ids).toArray(),
    ]);
    return { bookings, rentals };
  },
};
