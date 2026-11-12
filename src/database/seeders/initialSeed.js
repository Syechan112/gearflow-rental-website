import { db } from '../local/db';
import { SEED_BUSINESS, SEED_USERS, SEED_CATEGORIES } from './seedData';
import { SEED_EQUIPMENT, SEED_UNITS, SEED_CUSTOMERS } from './seedEquipment';
import { SEED_BOOKINGS, SEED_RENTALS } from './seedRentals';

export async function seedDatabase(force = false) {
  try {
    const userCount = await db.users.count();
    if (userCount > 0 && !force) {
      return false;
    }

    if (force) {
      await db.delete();
      await db.open();
    }

    await db.transaction('rw', [
      db.businesses,
      db.users,
      db.categories,
      db.equipment,
      db.equipment_units,
      db.customers,
      db.bookings,
      db.rental_orders,
      db.maintenance_records,
      db.equipment_bundles,
      db.audit_logs,
    ], async () => {
      await db.businesses.add(SEED_BUSINESS);
      await db.users.bulkAdd(SEED_USERS);
      await db.categories.bulkAdd(SEED_CATEGORIES);
      await db.equipment.bulkAdd(SEED_EQUIPMENT);
      await db.equipment_units.bulkAdd(SEED_UNITS);
      await db.customers.bulkAdd(SEED_CUSTOMERS);
      await db.bookings.bulkAdd(SEED_BOOKINGS);
      await db.rental_orders.bulkAdd(SEED_RENTALS);

      await db.maintenance_records.add({
        id: 'mnt-001',
        business_id: 'biz-apex',
        equipment_id: 'eq-canon-r6',
        unit_id: 'unt-canon-02',
        issue: 'Sensor cleaning & kalibrasi autofocus lensa',
        cost: 250000,
        technician: 'Canon Service Center Jakarta',
        status: 'in_progress',
        reported_at: '2026-11-10T11:00:00.000Z',
      });

      await db.equipment_bundles.add({
        id: 'bdl-001',
        business_id: 'biz-apex',
        name: 'Paket Video Creator Pro (Sony A7 IV + DJI RS 3)',
        description: 'Paket lengkap kamera mirrorless full-frame + gimbal stabilizer untuk shooting video profesional.',
        daily_price: 480000, // Discounted from 350k + 180k = 530k
        discount_percentage: 10,
        equipment_ids: ['eq-sony-a74', 'eq-dji-rs3'],
        createdAt: new Date().toISOString(),
      });

      await db.audit_logs.bulkAdd([
        { id: 'log-001', business_id: 'biz-apex', user_id: 'usr-owner', action: 'SYSTEM_INIT', details: 'GearFlow Local Database diinisialisasi', createdAt: '2026-11-10T08:00:00.000Z' },
        { id: 'log-002', business_id: 'biz-apex', user_id: 'usr-staff', action: 'MAINTENANCE_LOG', details: 'Unit SN-R6-002 dimasukkan ke antrean servis', createdAt: '2026-11-10T11:05:00.000Z' },
      ]);
    });

    return true;
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}
