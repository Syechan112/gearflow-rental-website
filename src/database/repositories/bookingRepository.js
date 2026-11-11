import { db } from '../local/db';
import { BOOKING_STATUS, UNIT_STATUS } from '@/constants/statuses';

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

  async create(booking) {
    await db.bookings.add(booking);
    return booking;
  },

  async updateStatus(id, status, notes = '') {
    const updateData = { status, updatedAt: new Date().toISOString() };
    if (notes) updateData.admin_notes = notes;
    await db.bookings.update(id, updateData);
    return await this.getById(id);
  },

  async checkAvailability(equipmentId, startDate, endDate, excludeBookingId = null) {
    const units = await db.equipment_units
      .where('equipment_id')
      .equals(equipmentId)
      .filter((u) => u.status !== UNIT_STATUS.MAINTENANCE && u.status !== UNIT_STATUS.DAMAGED)
      .toArray();

    const activeBookings = await db.bookings
      .where('equipment_id')
      .equals(equipmentId)
      .filter((b) => {
        if (excludeBookingId && b.id === excludeBookingId) return false;
        if (b.status !== BOOKING_STATUS.APPROVED && b.status !== BOOKING_STATUS.PENDING) return false;
        // Check date overlap: (StartA <= EndB) and (EndA >= StartB)
        return startDate <= b.end_date && endDate >= b.start_date;
      })
      .toArray();

    const availableSlots = Math.max(0, units.length - activeBookings.length);
    return {
      isAvailable: availableSlots > 0,
      totalUnits: units.length,
      bookedSlots: activeBookings.length,
      availableSlots,
    };
  },
};
