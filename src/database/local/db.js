import Dexie from 'dexie';
import { DB_NAME, DB_SCHEMA_V1, DB_SCHEMA_V2 } from './schema';
import { notifyDbChange } from '@/utils/dbEvents';

function attachChangeHooks(table) {
  const trigger = (trans) => {
    if (trans && typeof trans.on === 'function') {
      trans.on('complete', notifyDbChange);
    } else {
      notifyDbChange();
    }
  };

  table.hook('creating', (primKey, obj, trans) => {
    trigger(trans);
  });
  table.hook('updating', (mods, primKey, obj, trans) => {
    trigger(trans);
  });
  table.hook('deleting', (primKey, trans) => {
    trigger(trans);
  });
}

class GearFlowDatabase extends Dexie {
  constructor() {
    super(DB_NAME);
    this.version(1).stores(DB_SCHEMA_V1);
    this.version(2).stores(DB_SCHEMA_V2);

    this.tables.forEach((table) => {
      attachChangeHooks(table);
    });
  }
}

export const db = new GearFlowDatabase();

export async function clearDatabase() {
  await db.delete();
  await db.open();
  notifyDbChange();
}
