import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { Pagination } from '@/components/common/Pagination';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { EquipmentCard } from '../components/EquipmentCard';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { BookingModal } from '../components/BookingModal';
import { CatalogCategorySelector } from '../components/CatalogCategorySelector';
import { Sparkles } from 'lucide-react';

const PAGE_SIZE = 8;

export function CatalogPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return selectedCategory === 'all'
      ? equipmentList
      : equipmentList.filter((item) => item.category_id === selectedCategory);
  }, [equipmentList, selectedCategory]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

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

      <CatalogCategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        equipmentList={equipmentList}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-2">
        {paginated.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            onSelectForBooking={(eq) => setBookingItem(eq)}
            onOpenDetail={(eq) => setDetailItem(eq)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }}
      />

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
