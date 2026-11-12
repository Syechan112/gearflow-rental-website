import { db } from "../local/db";
import { UNIT_STATUS } from "@/constants/statuses";

export const equipmentRepository = {
  async getAll(businessId) {
    if (businessId) {
      return await db.equipment
        .where("business_id")
        .equals(businessId)
        .toArray();
    }
    return await db.equipment.toArray();
  },

  async getById(id) {
    return await db.equipment.get(id);
  },

  async getUnitsByEquipmentId(equipmentId) {
    return await db.equipment_units
      .where("equipment_id")
      .equals(equipmentId)
      .toArray();
  },

  async getAllUnits(businessId) {
    if (businessId) {
      return await db.equipment_units
        .where("business_id")
        .equals(businessId)
        .toArray();
    }
    return await db.equipment_units.toArray();
  },

  async getCategories(businessId) {
    if (businessId) {
      return await db.categories
        .where("business_id")
        .equals(businessId)
        .toArray();
    }
    return await db.categories.toArray();
  },

  async create(equipmentData) {
    await db.equipment.add(equipmentData);
    return equipmentData;
  },

  async update(id, updates) {
    await db.equipment.update(id, updates);
    return await this.getById(id);
  },

  async delete(id) {
    await db.equipment_units.where("equipment_id").equals(id).delete();
    return await db.equipment.delete(id);
  },
};
