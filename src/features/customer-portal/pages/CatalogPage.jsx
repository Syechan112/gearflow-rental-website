import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { EquipmentCard } from '../components/EquipmentCard';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { BookingModal } from '../components/BookingModal';
import { Sparkles, Layers, Camera, Tent, Sun, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

const CATEGORY_ICONS = {
  all: Layers,
  'cat-camera': Camera,
  'cat-camping': Tent,
  'cat-lighting': Sun,
  'cat-drone': Zap,
};

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

  const getCategoryCount = (catId) => {
    if (catId === 'all') return equipmentList.length;
    return equipmentList.filter((item) => item.category_id === catId).length;
  };

  const filtered = selectedCategory === 'all'
    ? equipmentList
    : equipmentList.filter((item) => item.category_id === selectedCategory);

  return (
    <PageContainer>
      <div className="text-center max-w-xl mx-auto py-4 sm:py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Katalog Peralatan Premium
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Pilih Alat & Kamera</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
          Koleksi kamera mirrorless, lensa cinema, drone, dan lighting berkualitas tinggi siap sewa harian.
        </p>
      </div>

      {/* Category Pills - Optimized for Mobile Touch Swiping & Desktop Centering */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-1 px-4 -mx-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
            selectedCategory === 'all'
              ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/10'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
            {equipmentList.length}
          </span>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
          const count = getCategoryCount(cat.id);
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/10'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-2">
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
