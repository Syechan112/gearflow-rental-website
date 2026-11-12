import { db } from '@/database/local/db';

/**
 * Resolves all possible identifier variations for a customer
 * (e.g. user ID 'usr-customer', customer ID 'cst-001', or email 'customer@gearflow.local').
 * This ensures queries match both demo seed data and live user accounts.
 */
export async function resolveCustomerIds(identifier) {
  if (!identifier) return [];
  const ids = new Set([identifier]);

  try {
    // 1. Check if identifier is in users table
    const user = await db.users.get(identifier);
    if (user?.email) {
      ids.add(user.email);
      const cust = await db.customers.where('email').equals(user.email).first();
      if (cust?.id) ids.add(cust.id);
    }

    // 2. Check if identifier is in customers table
    const cust = await db.customers.get(identifier);
    if (cust?.email) {
      ids.add(cust.email);
      const u = await db.users.where('email').equals(cust.email).first();
      if (u?.id) ids.add(u.id);
    }

    // 3. Check by email directly
    if (typeof identifier === 'string' && identifier.includes('@')) {
      const u = await db.users.where('email').equals(identifier).first();
      if (u?.id) ids.add(u.id);
      const c = await db.customers.where('email').equals(identifier).first();
      if (c?.id) ids.add(c.id);
    }
  } catch (err) {
    console.error('Error resolving customer IDs:', err);
  }

  return Array.from(ids);
}
