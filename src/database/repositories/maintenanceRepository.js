import { db } from '../local/db';
import { UNIT_STATUS } from '@/constants/statuses';

export const maintenanceRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.maintenance_records.where('business_id').equals(businessId).toArray();
    }
    return await db.maintenance_records.toArray();
  },

  async getById(id) {
    return await db.maintenance_records.get(id);
  },

  async create(record) {
    return await db.transaction('rw', [db.maintenance_records, db.equipment_units], async () => {
      await db.maintenance_records.add(record);
      await db.equipment_units.update(record.unit_id, {
        status: UNIT_STATUS.MAINTENANCE,
        condition: `Dalam Perbaikan: ${record.issue}`,
      });
      return record;
    });
  },

  async complete(id, notes = '', cost = 0) {
    const record = await db.maintenance_records.get(id);
    if (!record) return null;

    return await db.transaction('rw', [db.maintenance_records, db.equipment_units], async () => {
      await db.maintenance_records.update(id, {
        status: 'completed',
        completion_notes: notes,
        cost: cost || record.cost || 0,
        completed_at: new Date().toISOString(),
      });
      await db.equipment_units.update(record.unit_id, {
        status: UNIT_STATUS.AVAILABLE,
        condition: 'Siap Sewa / Servis Selesai',
      });
      return await db.maintenance_records.get(id);
    });
  },
};
