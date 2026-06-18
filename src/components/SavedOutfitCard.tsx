import { Trash2, WandSparkles } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import type { SavedOutfit, Occasion } from '@/types';

const OCCASION_LABELS: Record<Occasion, string> = {
  commute: '通勤',
  date: '约会',
  travel: '旅行',
  sport: '运动',
  interview: '面试',
};

interface SavedOutfitCardProps {
  outfit: SavedOutfit;
}

export default function SavedOutfitCard({ outfit }: SavedOutfitCardProps) {
  const { clothes, addToCanvas, removeSavedOutfit } = useWardrobeStore();

  const items = outfit.items
    .map((id) => clothes.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const handleApply = () => {
    items.forEach((item) => {
      addToCanvas(item.category, item.id);
    });
  };

  return (
    <div className="zone-section !p-0 overflow-hidden">
      <div className="grid grid-cols-3 gap-1 p-2">
        {items.map((item) => (
          <div key={item.id} className="aspect-square rounded-lg overflow-hidden">
            <img
              src={item.photo}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="px-3 pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="font-body font-semibold text-charcoal text-sm truncate">
            {outfit.name}
          </h4>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0',
              'bg-terracotta/10 text-terracotta-dark'
            )}
          >
            {OCCASION_LABELS[outfit.occasion]}
          </span>
        </div>

        <p className="text-[10px] text-warm-gray">
          {format(parseISO(outfit.savedAt), 'yyyy年M月d日')}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-terracotta text-white text-[11px] font-medium hover:bg-terracotta-dark transition-colors"
          >
            <WandSparkles size={12} />
            穿搭
          </button>
          <button
            onClick={() => removeSavedOutfit(outfit.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand/50 text-warm-gray text-[11px] hover:border-terracotta/50 hover:text-terracotta transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
