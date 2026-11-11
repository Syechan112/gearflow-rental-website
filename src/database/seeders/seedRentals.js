import { BOOKING_STATUS, RENTAL_STATUS } from '@/constants/statuses';

export const SEED_BOOKINGS = [
  {
    id: 'bk-001',
    business_id: 'biz-apex',
    customer_id: 'cst-001',
    equipment_id: 'eq-sony-a74',
    start_date: '2026-11-12',
    end_date: '2026-11-14',
    total_days: 2,
    total_price: 700000,
    deposit: 500000,
    status: BOOKING_STATUS.APPROVED,
    notes: 'Shooting video corporate',
    createdAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'bk-002',
    business_id: 'biz-apex',
    customer_id: 'cst-002',
    equipment_id: 'eq-dji-rs3',
    start_date: '2026-11-15',
    end_date: '2026-11-17',
    total_days: 2,
    total_price: 360000,
    deposit: 300000,
    status: BOOKING_STATUS.PENDING,
    notes: 'Pre-wedding event',
    createdAt: '2026-11-11T09:30:00.000Z',
  },
];

export const SEED_RENTALS = [
  {
    id: 'rnt-001',
    business_id: 'biz-apex',
    booking_id: 'bk-001',
    customer_id: 'cst-001',
    equipment_id: 'eq-sony-a74',
    unit_id: 'unt-sony-02',
    start_date: '2026-11-10',
    end_date: '2026-11-13',
    total_amount: 1050000,
    deposit_amount: 500000,
    paid_amount: 1050000,
    status: RENTAL_STATUS.ONGOING,
    late_fee: 0,
    createdAt: '2026-11-10T08:00:00.000Z',
  },
];
