import { ROLES } from '@/constants/roles';
import { UNIT_STATUS, BOOKING_STATUS, RENTAL_STATUS } from '@/constants/statuses';

export const SEED_BUSINESS = {
  id: 'biz-apex',
  name: 'Apex Gearflow Studio',
  phone: '081234567890',
  address: 'Jl. Senopati No. 42, Jakarta Selatan',
  currency: 'IDR',
  createdAt: new Date().toISOString(),
};

export const SEED_USERS = [
  {
    id: 'usr-owner',
    business_id: 'biz-apex',
    name: 'Budi Santoso (Owner)',
    email: 'owner@gearflow.local',
    role: ROLES.OWNER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-staff',
    business_id: 'biz-apex',
    name: 'Siti Rahma (Staff)',
    email: 'staff@gearflow.local',
    role: ROLES.STAFF,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    permissions: {
      can_checkout: true,
      can_approve_booking: true,
      can_view_reports: false,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-customer',
    business_id: 'biz-apex',
    name: 'Reza Pratama (Customer)',
    email: 'customer@gearflow.local',
    role: ROLES.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
];

export const SEED_CATEGORIES = [
  { id: 'cat-camera', business_id: 'biz-apex', slug: 'kamera', name: 'Kamera & Lensa', icon: 'Camera' },
  { id: 'cat-camping', business_id: 'biz-apex', slug: 'camping', name: 'Peralatan Outdoor', icon: 'Tent' },
  { id: 'cat-lighting', business_id: 'biz-apex', slug: 'lighting', name: 'Audio & Lighting', icon: 'Sun' },
  { id: 'cat-drone', business_id: 'biz-apex', slug: 'drone', name: 'Drone & Gimbal', icon: 'Zap' },
];
