import { db } from '../local/db';

export const inspectionRepository = {
  async getByRentalId(rentalOrderId) {
    return await db.rental_inspections
      .where('rental_order_id')
      .equals(rentalOrderId)
      .toArray();
  },

  async create(inspection) {
    await db.rental_inspections.add(inspection);
    return inspection;
  },
};
