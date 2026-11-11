import Dexie from 'dexie';
import { DB_NAME, DB_VERSION, DB_SCHEMA } from './schema';

class GearFlowDatabase extends Dexie {
  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(DB_SCHEMA);
  }
}

export const db = new GearFlowDatabase();

export async function clearDatabase() {
  await db.delete();
  await db.open();
}
