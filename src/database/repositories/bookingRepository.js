import { db } from '../local/db';
import { BOOKING_STATUS } from '@/constants/statuses';

export const bookingRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.bookings.where('business_id').equals(businessId).toArray();
    }
    return await db.bookings.toArray();
  },

  async getById(id) {
    return await db.bookings.get(id);
  },

  async getByCustomerId(customerId) {
    return await db.bookings.where('customer_id').equals(customerId).toArray();
  },

  async getByStatus(status, businessId) {
    let collection = db.bookings.where('status').equals(status);
    if (businessId) {
      return await collection.filter(b => b.business_id === businessId).toArray();
    }
    return await collection.toArray();
  },

  async create(booking) {
    await db.bookings.add(booking);
    return booking;
  },

  async updateStatus(id, status) {
    await db.bookings.update(id, { status, updatedAt: new Date().toISOString() });
    return await this.getById(id);
  },
};
