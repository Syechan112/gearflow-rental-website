import { db } from '../local/db';
import { UNIT_STATUS, BOOKING_STATUS, RENTAL_STATUS } from '@/constants/statuses';

export const dashboardRepository = {
  async getOwnerMetrics(businessId) {
    const rentals = await db.rental_orders.toArray();
    const equipment = await db.equipment.toArray();
    const units = await db.equipment_units.toArray();
    const bookings = await db.bookings.toArray();

    const totalRevenue = rentals.reduce((acc, r) => acc + (r.paid_amount || 0), 0);
    const activeRentals = rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING).length;
    const availableUnits = units.filter((u) => u.status === UNIT_STATUS.AVAILABLE).length;
    const pendingBookings = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length;

    return {
      totalRevenue,
      activeRentals,
      availableUnits,
      totalUnits: units.length,
      pendingBookings,
      totalEquipment: equipment.length,
    };
  },

  async getStaffMetrics(businessId) {
    const rentals = await db.rental_orders.toArray();
    const bookings = await db.bookings.toArray();
    const units = await db.equipment_units.toArray();

    const todayCheckouts = bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length;
    const todayReturns = rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING).length;
    const maintenanceCount = units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length;

    return {
      todayCheckouts,
      todayReturns,
      maintenanceCount,
      activeRentals: todayReturns,
    };
  },
};
