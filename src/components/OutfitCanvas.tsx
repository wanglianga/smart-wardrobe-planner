import { X, Shirt, Layers, Wind, ShoppingBag, Gem, Plus, Check } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { ClothingCategory } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';

interface OutfitCanvasProps {
  onSelectSlot?: (category: ClothingCategory) => void;
}

const categoryConfig: { id: ClothingCategory; label: string; icon: React.ElementType; emoji: string }[] = [
  { id: 'top', label: '上装', icon: Shirt, emoji: '👔' },
  { id: 'bottom', label: '下装', icon: Layers, emoji: '👖' },
  { id: 'outerwear', label: '外套', icon: Wind, emoji: '🧥' },
  { id: 'shoes_bag', label: '鞋包', icon: ShoppingBag, emoji: '👜' },
  { id: 'accessory', label: '配饰', icon: Gem, emoji: '💍' },
];

const colorMap: Record<string, string> = {
  '白色': '#FFFFFF',
  '黑色': '#1A1A1A',
  '灰色': '#9E9E9E',
  '深蓝色': '#1A237E',
  '藏蓝色': '#283593',
  '蓝色': '#1565C0',
  '卡其色': '#C8B560',
  '棕色': '#6D4C41',
  '驼色': '#C4A882',
  '米色': '#F5F0E8',
  '酒红色': '#7B1F3A',
  '墨绿色': '#2E5E4E',
  '粉色': '#F8BBD0',
  '红色': '#D32F2F',
  '银色': '#C0C0C0',
  '金色': '#D4AF37',
  '黄色': '#F9A825',
};

function DropZone({
  category,
  label,
  icon: Icon,
  emoji,
  itemId,
  onSelect,
}: {
  category: ClothingCategory;
  label: string;
  icon: React.ElementType;
  emoji: string;
  itemId: string | null;
  onSelect: () => void;
}) {
  const clothes = useWardrobeStore((s) => s.clothes);
  const removeFromCanvas = useWardrobeStore((s) => s.removeFromCanvas);
  const { isOver, setNodeRef } = useDroppable({ id: category });
  const item = itemId ? clothes.find((c) => c.id === itemId) : null;

  return (
    <div
      ref={setNodeRef}
      onClick={!item ? onSelect : undefined}
      className={cn(
        'relative rounded-xl transition-all duration-300 overflow-hidden',
        item
          ? 'bg-white border border-sand/50 shadow-card'
          : isOver
            ? 'border-2 border-dashed border-terracotta bg-terracotta/5 scale-[1.02] shadow-drop-active'
            : 'cursor-pointer border border-dashed border-sand/60 bg-ivory/40 hover:border-terracotta/50 hover:bg-cream/60'
      )}
    >
      {item ? (
        <div className="flex items-center gap-2.5 p-2.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <img
              src={item.photo}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            {item.washStatus !== 'clean' && (
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 backdrop-blur-[2px]">
                <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-charcoal whitespace-nowrap">
                  {item.washStatus === 'washing' ? '清洗中' : '晾干中'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-charcoal leading-tight">{item.name}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {item.colors.map((color) => (
                  <span
                    key={color}
                    className="h-2 w-2 rounded-full border border-sand/50"
                    style={{ backgroundColor: colorMap[color] || color }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-warm-gray/60">·</span>
              <span className="text-[10px] text-warm-gray">{item.material}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromCanvas(category);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand/40 text-warm-gray/70 transition-all hover:bg-terracotta hover:text-white hover:shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-2.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-light-warm/60">
            <span className="text-lg">{emoji}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-warm-gray/40" />
              <p className="text-[13px] font-medium text-warm-gray/50">{label}</p>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-warm-gray/40">
              <Plus className="h-2.5 w-2.5" />
              <span>拖拽或点击添加</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutfitCanvas({ onSelectSlot }: OutfitCanvasProps) {
  const outfitCanvas = useWardrobeStore((s) => s.outfitCanvas);
  const clothes = useWardrobeStore((s) => s.clothes);

  const filledCount = Object.values(outfitCanvas).filter((id) => id !== null).length;
  const totalCount = Object.keys(outfitCanvas).length;

  const canvasItemColors = Object.values(outfitCanvas)
    .filter((id): id is string => id !== null)
    .flatMap((id) => {
      const item = clothes.find((c) => c.id === id);
      return item ? item.colors : [];
    });

  const uniqueColors = [...new Set(canvasItemColors)];

  return (
    <div className="zone-section !p-0 overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-sand/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="zone-header-icon">
              <Layers className="h-3.5 w-3.5 text-terracotta" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal">搭配画布</h3>
              <p className="text-[11px] text-warm-gray">将衣物拖入对应区域组装穿搭</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {uniqueColors.length > 0 && (
              <div className="flex items-center gap-0.5">
                {uniqueColors.slice(0, 6).map((color, idx) => (
                  <span
                    key={`${color}-${idx}`}
                    className="h-3.5 w-3.5 rounded-full border border-sand/50 transition-all"
                    style={{ backgroundColor: colorMap[color] || color }}
                  />
                ))}
              </div>
            )}
            <span className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
              filledCount === totalCount
                ? 'bg-green-50 text-green-600'
                : filledCount > 0
                  ? 'bg-terracotta/10 text-terracotta-dark'
                  : 'bg-sand/40 text-warm-gray'
            )}>
              {filledCount === totalCount && <Check className="h-3 w-3" />}
              {filledCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {categoryConfig.map(({ id, label, icon, emoji }) => (
          <DropZone
            key={id}
            category={id}
            label={label}
            icon={icon}
            emoji={emoji}
            itemId={outfitCanvas[id]}
            onSelect={() => onSelectSlot?.(id)}
          />
        ))}
      </div>
    </div>
  );
}
