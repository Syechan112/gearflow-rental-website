import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BookingModal } from '../components/BookingModal';
import { Sparkles, ShoppingBag } from 'lucide-react';

export function CatalogPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const loadData = async () => {
    const [eq, cats] = await Promise.all([
      equipmentRepository.getAll(),
      equipmentRepository.getCategories(),
    ]);
    setEquipmentList(eq);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

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
          Peralatan fotografi, drone, dan lighting berkualitas tinggi siap sewa harian.
        </p>
      </div>

      {/* Category Pills */}
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="success" dot>Tersedia</Badge>
                </div>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{item.brand}</span>
                <h3 className="text-sm font-semibold text-neutral-900 mt-0.5 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400 block">Tarif Sewa</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(item.daily_price)}</span>
                <span className="text-[10px] text-neutral-400"> / hari</span>
              </div>
              <Button size="sm" icon={ShoppingBag} onClick={() => setSelectedItem(item)}>
                Sewa
              </Button>
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        equipment={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
