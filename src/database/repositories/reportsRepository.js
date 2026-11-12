import { db } from '../local/db';
import { RENTAL_STATUS } from '@/constants/statuses';

export const reportsRepository = {
  async getSummary(startDate, endDate) {
    const rentals = await db.rental_orders.toArray();
    const equipment = await db.equipment.toArray();
    const units = await db.equipment_units.toArray();
    const customers = await db.customers.toArray();

    const filteredRentals = rentals.filter((r) => {
      if (startDate && r.start_date < startDate) return false;
      if (endDate && r.start_date > endDate) return false;
      return true;
    });

    const totalRevenue = filteredRentals.reduce((sum, r) => sum + (r.paid_amount || r.total_amount || 0), 0);
    const totalLateFees = filteredRentals.reduce((sum, r) => sum + (r.late_fee || 0), 0);
    const totalDamageFees = filteredRentals.reduce((sum, r) => sum + (r.damage_fee || 0), 0);
    const completedCount = filteredRentals.filter((r) => r.status === RENTAL_STATUS.COMPLETED).length;
    const ongoingCount = filteredRentals.filter((r) => r.status === RENTAL_STATUS.ONGOING).length;

    // Top performing equipment
    const eqStats = {};
    for (const r of filteredRentals) {
      if (!eqStats[r.equipment_id]) {
        const item = equipment.find((e) => e.id === r.equipment_id);
        eqStats[r.equipment_id] = {
          id: r.equipment_id,
          name: item?.name || r.equipment_id,
          brand: item?.brand || '',
          rentalCount: 0,
          revenue: 0,
        };
      }
      eqStats[r.equipment_id].rentalCount += 1;
      eqStats[r.equipment_id].revenue += (r.total_amount || 0);
    }
    const topEquipment = Object.values(eqStats).sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      totalLateFees,
      totalDamageFees,
      totalTransactions: filteredRentals.length,
      completedCount,
      ongoingCount,
      totalEquipment: equipment.length,
      totalUnits: units.length,
      totalCustomers: customers.length,
      topEquipment,
      filteredRentals,
    };
  },
};
