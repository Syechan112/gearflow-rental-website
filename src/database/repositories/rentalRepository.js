import { db } from '../local/db';
import { RENTAL_STATUS, UNIT_STATUS, BOOKING_STATUS } from '@/constants/statuses';

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

  async processCheckout({ rentalOrder, unitId, inspection, bookingId, customerId }) {
    return await db.transaction('rw', [db.rental_orders, db.equipment_units, db.bookings, db.rental_inspections, db.customers], async () => {
      await db.rental_orders.add(rentalOrder);
      await db.equipment_units.update(unitId, { status: UNIT_STATUS.RENTED });
      if (bookingId) {
        await db.bookings.update(bookingId, { status: BOOKING_STATUS.COMPLETED });
      }
      if (inspection) {
        await db.rental_inspections.add(inspection);
      }
      if (customerId) {
        const customer = await db.customers.get(customerId);
        if (customer) {
          await db.customers.update(customerId, { total_rentals: (customer.total_rentals || 0) + 1 });
        }
      }
      return rentalOrder;
    });
  },

  async processReturn({ rentalId, unitId, returnData, inspection, nextUnitStatus = UNIT_STATUS.AVAILABLE }) {
    return await db.transaction('rw', [db.rental_orders, db.equipment_units, db.rental_inspections], async () => {
      await db.rental_orders.update(rentalId, {
        status: RENTAL_STATUS.COMPLETED,
        actual_return_date: returnData.actualReturnDate,
        late_fee: returnData.lateFee || 0,
        damage_fee: returnData.damageFee || 0,
        deposit_refunded: returnData.depositRefunded || 0,
        paid_amount: returnData.finalPaidAmount,
        updatedAt: new Date().toISOString(),
      });
      await db.equipment_units.update(unitId, {
        status: nextUnitStatus,
        condition: returnData.conditionNotes || 'Selesai Sewa',
      });
      if (inspection) {
        await db.rental_inspections.add(inspection);
      }
      return await db.rental_orders.get(rentalId);
    });
  },

  async recordPayment(rentalId, paymentAmount) {
    const order = await db.rental_orders.get(rentalId);
    if (!order) return null;
    const newPaid = (order.paid_amount || 0) + paymentAmount;
    await db.rental_orders.update(rentalId, { paid_amount: newPaid, updatedAt: new Date().toISOString() });
    return await db.rental_orders.get(rentalId);
  },
};
