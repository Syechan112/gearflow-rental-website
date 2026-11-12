import { db } from '@/database/local/db';
import { RENTAL_STATUS } from '@/constants/statuses';
import { auditRepository } from '@/database/repositories/auditRepository';

export async function runAutomationJobs() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const ongoingRentals = await db.rental_orders
      .where('status')
      .equals(RENTAL_STATUS.ONGOING)
      .toArray();

    let overdueCount = 0;
    for (const order of ongoingRentals) {
      if (order.end_date < todayStr) {
        const scheduledEnd = new Date(order.end_date);
        const today = new Date(todayStr);
        const diffDays = Math.max(1, Math.ceil((today - scheduledEnd) / (1000 * 60 * 60 * 24)));

        // Retrieve equipment for daily rate
        const eq = await db.equipment.get(order.equipment_id);
        const dailyRate = eq?.daily_price || 150000;
        const autoLateFee = diffDays * Math.round(dailyRate * 1.5);

        await db.rental_orders.update(order.id, {
          status: RENTAL_STATUS.OVERDUE,
          late_fee: autoLateFee,
          updatedAt: new Date().toISOString(),
        });

        await auditRepository.log(
          'system_cron',
          'AUTO_OVERDUE_MARKED',
          `Order ${order.id} melewati jadwal (${diffDays} hari terlambat). Denda dihitung: Rp ${autoLateFee.toLocaleString('id-ID')}`
        );
        overdueCount++;
      }
    }
    return { success: true, overdueCount };
  } catch (err) {
    console.error('Automation engine error:', err);
    return { success: false, error: err };
  }
}
