import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Nama pelanggan minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor telepon minimal 9 digit'),
  id_number: z.string().min(6, 'Nomor KTP / Identitas minimal 6 digit'),
  address: z.string().optional(),
});
