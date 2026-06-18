import { RefreshCw } from 'lucide-react';
import type { SmartTip, ClothingItem, ClothingCategory } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';

interface ReplacementSuggestionsProps {
  tips: SmartTip[];
}

function SuggestionCard({
  item,
  onReplace,
}: {
  item: ClothingItem;
  onReplace: () => void;
}) {
  return (
    <button
      onClick={onReplace}
      className="flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl border border-sand/40 bg-white p-1.5 shadow-card transition-all hover:border-terracotta/40 hover:shadow-zone active:scale-[0.97]"
    >
      <img src={item.photo} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
      <p className="w-full truncate text-center text-[10px] font-medium text-charcoal">{item.name}</p>
    </button>
  );
}

export default function ReplacementSuggestions({ tips }: ReplacementSuggestionsProps) {
  const clothes = useWardrobeStore((s) => s.clothes);
  const outfitCanvas = useWardrobeStore((s) => s.outfitCanvas);
  const addToCanvas = useWardrobeStore((s) => s.addToCanvas);

  const problemItems = tips
    .filter((t) => t.level === 'error' || t.level === 'warning')
    .filter((t) => t.itemId);

  if (problemItems.length === 0) return null;

  const seenItemIds = new Set<string>();
  const uniqueProblemItems = problemItems.filter((t) => {
    if (seenItemIds.has(t.itemId!)) return false;
    seenItemIds.add(t.itemId!);
    return true;
  });

  const getAlternatives = (itemId: string): ClothingItem[] => {
    const item = clothes.find((c) => c.id === itemId);
    if (!item) return [];
    const canvasIds = new Set(Object.values(outfitCanvas).filter(Boolean) as string[]);
    return clothes.filter(
      (c) =>
        c.category === item.category &&
        c.id !== item.id &&
        !canvasIds.has(c.id) &&
        c.washStatus === 'clean'
    ).slice(0, 4);
  };

  const hasAnyAlternatives = uniqueProblemItems.some((t) => getAlternatives(t.itemId!).length > 0);
  if (!hasAnyAlternatives) return null;

  return (
    <div className="zone-section !p-0 overflow-hidden">
      <div className="zone-header mx-4 mt-4 mb-0">
        <div className="zone-header-icon">
          <RefreshCw className="h-3 w-3 text-terracotta" />
        </div>
        <div>
          <h3 className="zone-title">替换建议</h3>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-3">
        {uniqueProblemItems.map((tip) => {
          const item = clothes.find((c) => c.id === tip.itemId);
          if (!item) return null;
          const alternatives = getAlternatives(tip.itemId!);
          if (alternatives.length === 0) return null;

          return (
            <div key={tip.itemId} className="animate-slide-up">
              <p className="mb-1.5 text-[11px] text-warm-gray px-1">
                替换 <span className="font-medium text-charcoal">{item.name}</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {alternatives.map((alt) => (
                  <SuggestionCard
                    key={alt.id}
                    item={alt}
                    onReplace={() => addToCanvas(item.category as ClothingCategory, alt.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
