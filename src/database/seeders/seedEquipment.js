import { UNIT_STATUS, BOOKING_STATUS, RENTAL_STATUS } from '@/constants/statuses';

export const SEED_EQUIPMENT = [
  {
    id: 'eq-sony-a74',
    business_id: 'biz-apex',
    category_id: 'cat-camera',
    name: 'Sony Alpha 7 IV (Body Only)',
    brand: 'Sony',
    model: 'ILCE-7M4',
    daily_price: 350000,
    deposit_amount: 500000,
    total_stock: 3,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    description: 'Kamera hybrid full-frame 33MP dengan rekaman 4K 60p 10-bit 4:2:2.',
  },
  {
    id: 'eq-canon-r6',
    business_id: 'biz-apex',
    category_id: 'cat-camera',
    name: 'Canon EOS R6 Mark II + 24-70mm',
    brand: 'Canon',
    model: 'EOS R6 II',
    daily_price: 450000,
    deposit_amount: 700000,
    total_stock: 2,
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    description: 'Kamera pro mirrorless dengan lensa versatile RF 24-70mm f/2.8L USM.',
  },
  {
    id: 'eq-dji-rs3',
    business_id: 'biz-apex',
    category_id: 'cat-drone',
    name: 'DJI RS 3 Pro Gimbal Stabilizer',
    brand: 'DJI',
    model: 'RS 3 Pro',
    daily_price: 180000,
    deposit_amount: 300000,
    total_stock: 4,
    image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    description: 'Gimbal profesional berbahan serat karbon dengan motor autofokus LiDAR.',
  },
  {
    id: 'eq-aputure-300d',
    business_id: 'biz-apex',
    category_id: 'cat-lighting',
    name: 'Aputure LS 300d II Light Kit',
    brand: 'Aputure',
    model: 'LS 300d II',
    daily_price: 250000,
    deposit_amount: 400000,
    total_stock: 3,
    image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    description: 'Lampu COB daylight 5500K dengan wireless remote dan softbox Light Dome.',
  },
];

export const SEED_UNITS = [
  { id: 'unt-sony-01', equipment_id: 'eq-sony-a74', business_id: 'biz-apex', serial_number: 'SN-A74-001', status: UNIT_STATUS.AVAILABLE, condition: 'Sangat Baik' },
  { id: 'unt-sony-02', equipment_id: 'eq-sony-a74', business_id: 'biz-apex', serial_number: 'SN-A74-002', status: UNIT_STATUS.RENTED, condition: 'Normal' },
  { id: 'unt-sony-03', equipment_id: 'eq-sony-a74', business_id: 'biz-apex', serial_number: 'SN-A74-003', status: UNIT_STATUS.AVAILABLE, condition: 'Sangat Baik' },
  { id: 'unt-canon-01', equipment_id: 'eq-canon-r6', business_id: 'biz-apex', serial_number: 'SN-R6-001', status: UNIT_STATUS.AVAILABLE, condition: 'Sangat Baik' },
  { id: 'unt-canon-02', equipment_id: 'eq-canon-r6', business_id: 'biz-apex', serial_number: 'SN-R6-002', status: UNIT_STATUS.MAINTENANCE, condition: 'Perlu Sensor Cleaning' },
  { id: 'unt-dji-01', equipment_id: 'eq-dji-rs3', business_id: 'biz-apex', serial_number: 'SN-RS3-001', status: UNIT_STATUS.AVAILABLE, condition: 'Sangat Baik' },
];

export const SEED_CUSTOMERS = [
  { id: 'cst-001', business_id: 'biz-apex', name: 'Reza Pratama', email: 'customer@gearflow.local', phone: '081399887766', id_number: '3171012345670001', total_rentals: 4 },
  { id: 'cst-002', business_id: 'biz-apex', name: 'Dian Sastro Studio', email: 'dian@studio.id', phone: '081288776655', id_number: '3171098765430002', total_rentals: 12 },
];
