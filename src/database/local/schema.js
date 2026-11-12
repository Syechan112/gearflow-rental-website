export const DB_NAME = 'GearFlowDB';
export const DB_VERSION = 2;

export const DB_SCHEMA_V1 = {
  users: 'id, email, role, business_id, name',
  businesses: 'id, name, currency',
  categories: 'id, business_id, slug, name',
  equipment: 'id, business_id, category_id, name, brand, daily_price',
  equipment_units: 'id, equipment_id, business_id, serial_number, status, condition',
  customers: 'id, business_id, name, email, phone',
  bookings: 'id, business_id, customer_id, equipment_id, status, start_date, end_date',
  rental_orders: 'id, business_id, customer_id, booking_id, status, start_date, end_date',
  rental_inspections: 'id, rental_order_id, type, inspector_id',
  maintenance_records: 'id, equipment_id, unit_id, status, business_id',
  audit_logs: 'id, business_id, user_id, action, createdAt',
};

export const DB_SCHEMA_V2 = {
  ...DB_SCHEMA_V1,
  equipment_bundles: 'id, business_id, name, daily_price',
  business_settings: 'id, business_id',
};
