import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { EquipmentCard } from '../components/EquipmentCard';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { BookingModal } from '../components/BookingModal';
import { Sparkles } from 'lucide-react';

export function CatalogPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingItem, setBookingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const loadData = async () => {
    const [eq, cats] = await Promise.all([
      equipmentRepository.getAll(),
      equipmentRepository.getCategories(),
    ]);
    setEquipmentList(eq);
    setCategories(cats);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = selectedCategory === 'all'
    ? equipmentList
    : equipmentList.filter((item) => item.category_id === selectedCategory);

  return (
    <PageContainer>
      <div className="text-center max-w-xl mx-auto py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Katalog Peralatan Premium
        </span>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Pilih Alat & Kamera</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Koleksi kamera mirrorless, lensa cinema, drone, dan lighting berkualitas tinggi siap sewa harian.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-btn text-xs font-medium transition-colors cursor-pointer ${
            selectedCategory === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          Semua Kategori
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-btn text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.id ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            onSelectForBooking={(eq) => setBookingItem(eq)}
            onOpenDetail={(eq) => setDetailItem(eq)}
          />
        ))}
      </div>

      <EquipmentDetailModal
        equipment={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onBookNow={(eq) => setBookingItem(eq)}
      />

      <BookingModal
        equipment={bookingItem}
        isOpen={!!bookingItem}
        onClose={() => setBookingItem(null)}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
