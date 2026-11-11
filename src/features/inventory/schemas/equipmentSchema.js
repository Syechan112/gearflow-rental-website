import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(3, 'Nama peralatan minimal 3 karakter'),
  category_id: z.string().min(1, 'Pilih kategori peralatan'),
  brand: z.string().min(2, 'Merk minimal 2 karakter'),
  model: z.string().min(1, 'Model wajib diisi'),
  daily_price: z.number({ invalid_type_error: 'Tarif harus berupa angka' }).min(1000, 'Tarif sewa minimal Rp 1.000'),
  deposit_amount: z.number({ invalid_type_error: 'Deposit harus berupa angka' }).min(0, 'Deposit tidak boleh negatif'),
  description: z.string().optional(),
  image_url: z.string().url('URL foto tidak valid').or(z.string().min(5, 'Masukkan link gambar')),
});
