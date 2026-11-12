import { useState, useEffect, useCallback } from 'react';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { BOOKING_STATUS, RENTAL_STATUS, UNIT_STATUS } from '@/constants/statuses';
import { subscribeToDbChanges } from '@/utils/dbEvents';

export function useStaffBadgeCounts() {
  const [counts, setCounts] = useState({
    pending: 0,
    checkout: 0,
    returns: 0,
    maint: 0,
  });

  const loadCounts = useCallback(async () => {
    try {
      const [bookings, rentals, units] = await Promise.all([
        bookingRepository.getAll(),
        rentalRepository.getAll(),
        unitRepository.getAll(),
      ]);

      setCounts({
        pending: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
        checkout: bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length,
        returns: rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING || r.status === 'overdue').length,
        maint: units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length,
      });
    } catch (err) {
      console.error('Failed to load staff badge counts', err);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    const unsubscribe = subscribeToDbChanges(loadCounts);
    return () => unsubscribe();
  }, [loadCounts]);

  return counts;
}

export function useCustomerBadgeCounts(userId) {
  const [counts, setCounts] = useState({ bookings: 0, rentals: 0 });

  const loadCounts = useCallback(async () => {
    if (!userId) {
      setCounts({ bookings: 0, rentals: 0 });
      return;
    }
    try {
      const [b, r] = await Promise.all([
        bookingRepository.getByCustomerId(userId),
        rentalRepository.getByCustomerId(userId),
      ]);

      setCounts({
        bookings: b.filter((item) => item.status === 'pending' || item.status === 'approved').length,
        rentals: r.filter((item) => item.status === 'ongoing' || item.status === 'overdue').length,
      });
    } catch (err) {
      console.error('Failed to load customer badge counts', err);
    }
  }, [userId]);

  useEffect(() => {
    loadCounts();
    const unsubscribe = subscribeToDbChanges(loadCounts);
    return () => unsubscribe();
  }, [loadCounts]);

  return counts;
}

export function useOwnerBadgeCounts() {
  const [counts, setCounts] = useState({
    pendingBookings: 0,
    ongoingRentals: 0,
    maintenanceUnits: 0,
  });

  const loadCounts = useCallback(async () => {
    try {
      const [bookings, rentals, units] = await Promise.all([
        bookingRepository.getAll(),
        rentalRepository.getAll(),
        unitRepository.getAll(),
      ]);

      setCounts({
        pendingBookings: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
        ongoingRentals: rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING || r.status === 'overdue').length,
        maintenanceUnits: units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length,
      });
    } catch (err) {
      console.error('Failed to load owner badge counts', err);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    const unsubscribe = subscribeToDbChanges(loadCounts);
    return () => unsubscribe();
  }, [loadCounts]);

  return counts;
}
