import { RefreshCw } from 'lucide-react';
import type { SmartTip, ClothingCategory, AlternativeWithReasons } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { findAlternatives } from '@/utils/smartTips';
import { cn } from '@/lib/utils';

interface ReplacementSuggestionsProps {
  tips: SmartTip[];
}

function SuggestionCard({
  alt,
  onReplace,
}: {
  alt: AlternativeWithReasons;
  onReplace: () => void;
}) {
  return (
    <button
      onClick={onReplace}
      className="flex w-[80px] shrink-0 flex-col items-center gap-1 rounded-xl border border-sand/40 bg-white p-1.5 shadow-card transition-all hover:border-terracotta/40 hover:shadow-zone active:scale-[0.97]"
    >
      <img src={alt.item.photo} alt={alt.item.name} className="h-12 w-12 rounded-lg object-cover" />
      <p className="w-full truncate text-center text-[10px] font-medium text-charcoal">{alt.item.name}</p>
      <div className="flex items-center gap-0.5 flex-wrap justify-center">
        {alt.matchReasons.map((reason) => (
          <span
            key={reason}
            className={cn(
              'text-[7px] px-1 py-0.5 rounded',
              reason === '颜色相近' ? 'bg-pink-50 text-pink-400' :
              reason === '版型相似' ? 'bg-blue-50 text-blue-400' :
              'bg-green-50 text-green-400'
            )}
          >
            {reason}
          </span>
        ))}
      </div>
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

  const getAlternatives = (itemId: string): AlternativeWithReasons[] => {
    const item = clothes.find((c) => c.id === itemId);
    if (!item) return [];
    const canvasIds = new Set(Object.values(outfitCanvas).filter(Boolean) as string[]);
    return findAlternatives(item, clothes, canvasIds);
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
                    key={alt.item.id}
                    alt={alt}
                    onReplace={() => addToCanvas(item.category as ClothingCategory, alt.item.id)}
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
