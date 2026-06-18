import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, Plus } from 'lucide-react';
import CategoryNav from '@/components/CategoryNav';
import FilterBar from '@/components/FilterBar';
import ClothingCard from '@/components/ClothingCard';
import { useWardrobeStore } from '@/store/useWardrobeStore';

export default function WardrobePage() {
  const navigate = useNavigate();
  const clothes = useWardrobeStore((s) => s.clothes);
  const activeCategory = useWardrobeStore((s) => s.activeCategory);
  const filters = useWardrobeStore((s) => s.filters);
  const addToCanvas = useWardrobeStore((s) => s.addToCanvas);

  const filteredClothes = useMemo(() => {
    return clothes.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (filters.colors.length > 0 && !item.colors.some((c) => filters.colors.includes(c))) return false;
      if (filters.materials.length > 0 && !filters.materials.includes(item.material)) return false;
      if (filters.seasons.length > 0 && !item.seasons.some((s) => filters.seasons.includes(s))) return false;
      if (filters.washStatus && item.washStatus !== filters.washStatus) return false;
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [clothes, activeCategory, filters]);

  const handleCardClick = (id: string) => {
    const item = clothes.find((c) => c.id === id);
    if (item) {
      addToCanvas(item.category, item.id);
      navigate('/outfit');
    }
  };

  return (
    <div className="min-h-screen bg-ivory font-body">
      <header className="flex items-center justify-between px-5 py-4 bg-ivory border-b border-sand/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta/10">
            <Shirt className="h-4 w-4 text-terracotta" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-charcoal leading-tight">我的衣橱</h1>
            <p className="text-[10px] text-warm-gray">点选衣物添加到搭配画布</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/outfit')}
          className="flex items-center gap-1.5 rounded-lg bg-terracotta px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-terracotta-dark"
        >
          <Plus className="h-3 w-3" />
          去搭配
        </button>
      </header>

      <div className="px-4 pb-6 space-y-3">
        <CategoryNav />
        <FilterBar />

        {filteredClothes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-warm-gray">
            <Shirt className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">没有匹配的衣物</p>
            <p className="text-[11px] mt-1">试试调整筛选条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
            {filteredClothes.map((item) => (
              <ClothingCard key={item.id} item={item} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
