import { db } from '../local/db';

export const userRepository = {
  async getAll() {
    return await db.users.toArray();
  },

  async getById(id) {
    return await db.users.get(id);
  },

  async getByEmail(email) {
    return await db.users.where('email').equalsIgnoreCase(email).first();
  },

  async getByRole(role) {
    return await db.users.where('role').equals(role).toArray();
  },

  async create(user) {
    await db.users.add(user);
    return user;
  },

  async update(id, updates) {
    await db.users.update(id, updates);
    return await this.getById(id);
  },
};
