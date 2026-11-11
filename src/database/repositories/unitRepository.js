import { db } from '../local/db';
import { UNIT_STATUS } from '@/constants/statuses';

export const unitRepository = {
  async getByEquipmentId(equipmentId) {
    return await db.equipment_units.where('equipment_id').equals(equipmentId).toArray();
  },

  async getAll(businessId) {
    if (businessId) {
      return await db.equipment_units.where('business_id').equals(businessId).toArray();
    }
    return await db.equipment_units.toArray();
  },

  async getById(id) {
    return await db.equipment_units.get(id);
  },

  async create(unit) {
    await db.equipment_units.add(unit);
    // update total stock in equipment
    const count = await db.equipment_units.where('equipment_id').equals(unit.equipment_id).count();
    await db.equipment.update(unit.equipment_id, { total_stock: count });
    return unit;
  },

  async updateStatus(id, status, notes = '') {
    const updateData = { status };
    if (notes) updateData.condition = notes;
    await db.equipment_units.update(id, updateData);
    return await this.getById(id);
  },

  async delete(id) {
    const unit = await this.getById(id);
    await db.equipment_units.delete(id);
    if (unit) {
      const count = await db.equipment_units.where('equipment_id').equals(unit.equipment_id).count();
      await db.equipment.update(unit.equipment_id, { total_stock: count });
    }
    return true;
  },
};
