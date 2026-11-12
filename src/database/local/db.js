import Dexie from 'dexie';
import { DB_NAME, DB_SCHEMA_V1, DB_SCHEMA_V2 } from './schema';

class GearFlowDatabase extends Dexie {
  constructor() {
    super(DB_NAME);
    this.version(1).stores(DB_SCHEMA_V1);
    this.version(2).stores(DB_SCHEMA_V2);
  }
}

export const db = new GearFlowDatabase();

export async function clearDatabase() {
  await db.delete();
  await db.open();
}
