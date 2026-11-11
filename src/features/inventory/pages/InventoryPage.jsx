import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { categoryRepository } from '@/database/repositories/categoryRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { InventoryFilterBar } from '../components/InventoryFilterBar';
import { InventoryTable } from '../components/InventoryTable';
import { EquipmentModal } from '../components/EquipmentModal';
import { CategoryModal } from '../components/CategoryModal';
import { UnitManagerModal } from '../components/UnitManagerModal';
import { Button } from '@/components/ui/Button';
import { Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function InventoryPage() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [editingEq, setEditingEq] = useState(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [managingUnitsEq, setManagingUnitsEq] = useState(null);

  const loadData = async () => {
    const [eq, cats, unts] = await Promise.all([
      equipmentRepository.getAll(),
      categoryRepository.getAll(),
      unitRepository.getAll(),
    ]);
    setEquipment(eq);
    setCategories(cats);
    setUnits(unts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peralatan ini beserta unit fisiknya?')) {
      await equipmentRepository.delete(id);
      toast.success('Peralatan berhasil dihapus');
      loadData();
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category_id === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q) || item.model.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Inventaris & Manajemen Unit"
        description="Daftar peralatan, tarif sewa harian, jumlah total stok, serta pelacakan nomor seri unit fisik."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={Tag} onClick={() => setIsCatModalOpen(true)}>
              Kategori
            </Button>
            <Button size="sm" icon={Plus} onClick={() => { setEditingEq(null); setIsEqModalOpen(true); }}>
              Tambah Alat
            </Button>
          </div>
        }
      />

      <InventoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <InventoryTable
        equipment={filteredEquipment}
        units={units}
        onEdit={(item) => { setEditingEq(item); setIsEqModalOpen(true); }}
        onManageUnits={(item) => setManagingUnitsEq(item)}
        onDelete={handleDelete}
      />

      <EquipmentModal
        isOpen={isEqModalOpen}
        onClose={() => { setIsEqModalOpen(false); setEditingEq(null); }}
        initialData={editingEq}
        categories={categories}
        onSuccess={loadData}
      />

      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onSuccess={loadData}
      />

      <UnitManagerModal
        isOpen={!!managingUnitsEq}
        equipment={managingUnitsEq}
        onClose={() => setManagingUnitsEq(null)}
        onUpdated={loadData}
      />
    </PageContainer>
  );
}
