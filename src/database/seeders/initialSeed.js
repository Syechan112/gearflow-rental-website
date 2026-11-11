import { db } from '../local/db';
import { SEED_BUSINESS, SEED_USERS, SEED_CATEGORIES } from './seedData';
import { SEED_EQUIPMENT, SEED_UNITS, SEED_CUSTOMERS } from './seedEquipment';
import { SEED_BOOKINGS, SEED_RENTALS } from './seedRentals';

export async function seedDatabase(force = false) {
  try {
    const userCount = await db.users.count();
    if (userCount > 0 && !force) {
      return false; // Database already seeded
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
    ], async () => {
      await db.businesses.add(SEED_BUSINESS);
      await db.users.bulkAdd(SEED_USERS);
      await db.categories.bulkAdd(SEED_CATEGORIES);
      await db.equipment.bulkAdd(SEED_EQUIPMENT);
      await db.equipment_units.bulkAdd(SEED_UNITS);
      await db.customers.bulkAdd(SEED_CUSTOMERS);
      await db.bookings.bulkAdd(SEED_BOOKINGS);
      await db.rental_orders.bulkAdd(SEED_RENTALS);
    });

    return true;
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}
