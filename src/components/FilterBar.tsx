import { Search, X } from 'lucide-react';
import type { Season, WashStatus } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { cn } from '@/lib/utils';

const colorOptions = ['白', '黑', '灰', '蓝', '棕', '红', '绿', '粉', '米', '驼', '金', '银'];
const materialOptions = ['棉', '羊毛', '真丝', '亚麻', '牛仔', '真皮', '雪纺'];
const seasonOptions: { label: string; value: Season }[] = [
  { label: '春', value: 'spring' },
  { label: '夏', value: 'summer' },
  { label: '秋', value: 'autumn' },
  { label: '冬', value: 'winter' },
];
const washStatusOptions: { label: string; value: WashStatus }[] = [
  { label: '干净', value: 'clean' },
  { label: '清洗中', value: 'washing' },
  { label: '晾干中', value: 'drying' },
];

export default function FilterBar() {
  const filters = useWardrobeStore((s) => s.filters);
  const setFilters = useWardrobeStore((s) => s.setFilters);
  const resetFilters = useWardrobeStore((s) => s.resetFilters);

  const hasFilters = filters.colors.length > 0 || filters.materials.length > 0 || filters.seasons.length > 0 || filters.washStatus !== null || filters.search !== '';

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    setFilters({ colors: next });
  };

  const toggleMaterial = (material: string) => {
    const next = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    setFilters({ materials: next });
  };

  const toggleSeason = (season: Season) => {
    const next = filters.seasons.includes(season)
      ? filters.seasons.filter((s) => s !== season)
      : [...filters.seasons, season];
    setFilters({ seasons: next });
  };

  return (
    <div className="space-y-2 font-body text-[11px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-warm-gray">筛选条件</span>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[10px] text-terracotta hover:text-terracotta-dark transition-colors"
          >
            <X className="h-2.5 w-2.5" />
            清除
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="shrink-0 text-warm-gray/60 text-[10px]">颜色</span>
        {colorOptions.map((color) => (
          <button
            key={color}
            onClick={() => toggleColor(color)}
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 transition-colors',
              filters.colors.includes(color)
                ? 'bg-terracotta text-white'
                : 'bg-sand/40 text-charcoal/70 hover:bg-sand/60'
            )}
          >
            {color}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="shrink-0 text-warm-gray/60 text-[10px]">材质</span>
        {materialOptions.map((material) => (
          <button
            key={material}
            onClick={() => toggleMaterial(material)}
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 transition-colors',
              filters.materials.includes(material)
                ? 'bg-terracotta text-white'
                : 'bg-sand/40 text-charcoal/70 hover:bg-sand/60'
            )}
          >
            {material}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="shrink-0 text-warm-gray/60 text-[10px]">季节</span>
        {seasonOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => toggleSeason(value)}
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 transition-colors',
              filters.seasons.includes(value)
                ? 'bg-terracotta text-white'
                : 'bg-sand/40 text-charcoal/70 hover:bg-sand/60'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="shrink-0 text-warm-gray/60 text-[10px]">洗涤</span>
        {washStatusOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() =>
              setFilters({ washStatus: filters.washStatus === value ? null : value })
            }
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 transition-colors',
              filters.washStatus === value
                ? 'bg-terracotta text-white'
                : 'bg-sand/40 text-charcoal/70 hover:bg-sand/60'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-warm-gray/50" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="搜索衣物..."
          className="w-full rounded-full border border-sand/50 bg-white/80 py-1.5 pl-7 pr-3 text-[11px] text-charcoal placeholder:text-warm-gray/40 focus:border-terracotta/50 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}
