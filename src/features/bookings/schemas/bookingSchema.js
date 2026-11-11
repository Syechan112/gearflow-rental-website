import { z } from 'zod';

export const bookingSchema = z.object({
  equipment_id: z.string().min(1, 'Pilih peralatan sewa'),
  customer_id: z.string().min(1, 'Pilih pelanggan'),
  start_date: z.string().min(1, 'Pilih tanggal mulai'),
  end_date: z.string().min(1, 'Pilih tanggal selesai'),
  notes: z.string().optional(),
}).refine((data) => data.end_date >= data.start_date, {
  message: 'Tanggal selesai harus sama atau setelah tanggal mulai',
  path: ['end_date'],
});
