import { Shirt, Layers, Wind, ShoppingBag, Gem } from 'lucide-react';
import type { ClothingCategory } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { cn } from '@/lib/utils';

const tabs: { key: ClothingCategory; label: string; icon: React.ElementType; emoji: string }[] = [
  { key: 'top', label: '上装', icon: Shirt, emoji: '👔' },
  { key: 'bottom', label: '下装', icon: Layers, emoji: '👖' },
  { key: 'outerwear', label: '外套', icon: Wind, emoji: '🧥' },
  { key: 'shoes_bag', label: '鞋包', icon: ShoppingBag, emoji: '👜' },
  { key: 'accessory', label: '配饰', icon: Gem, emoji: '💍' },
];

export default function CategoryNav() {
  const activeCategory = useWardrobeStore((s) => s.activeCategory);
  const setActiveCategory = useWardrobeStore((s) => s.setActiveCategory);
  const clothes = useWardrobeStore((s) => s.clothes);

  return (
    <nav className="flex lg:flex-col items-stretch bg-ivory/60">
      {tabs.map(({ key, label, icon: Icon, emoji }) => {
        const isActive = activeCategory === key;
        const count = clothes.filter((c) => c.category === key).length;
        return (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'flex flex-1 lg:flex-row lg:flex-none lg:gap-2.5 lg:px-3 lg:py-2.5 flex-col items-center gap-0.5 lg:gap-2 py-2 text-xs font-body transition-all relative',
              isActive
                ? 'text-terracotta bg-terracotta/5 lg:bg-terracotta/8'
                : 'text-warm-gray hover:text-charcoal hover:bg-light-warm/30 lg:hover:bg-light-warm/60'
            )}
          >
            <span className="text-base lg:hidden">{emoji}</span>
            <Icon className="h-4 w-4 hidden lg:block" />
            <span className="lg:text-xs lg:font-medium">{label}</span>
            <span className={cn(
              'hidden lg:inline-block text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center',
              isActive ? 'bg-terracotta/15 text-terracotta' : 'bg-sand/40 text-warm-gray'
            )}>
              {count}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-terracotta lg:hidden" />
            )}
            {isActive && (
              <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-terracotta" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
