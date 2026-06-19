import { X, Shirt, Layers, Wind, ShoppingBag, Gem, Plus, Check, AlertTriangle, Eye, CloudRain, Thermometer, Sun, Undo2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { ClothingCategory, WashStatus, WeatherRemoval } from '@/types';
import { WASH_STATUS_LABELS } from '@/types';
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

function getWashStatusLabel(status: WashStatus): string | null {
  if (status === 'clean') return null;
  return WASH_STATUS_LABELS[status];
}

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
  const smartTips = useWardrobeStore((s) => s.smartTips);
  const forcedItems = useWardrobeStore((s) => s.forcedItems);
  const addForcedItem = useWardrobeStore((s) => s.addForcedItem);
  const removeForcedItem = useWardrobeStore((s) => s.removeForcedItem);
  const weatherRemovals = useWardrobeStore((s) => s.weatherRemovals);
  const addToCanvas = useWardrobeStore((s) => s.addToCanvas);
  const clearWeatherRemoval = useWardrobeStore((s) => s.clearWeatherRemoval);
  const { isOver, setNodeRef } = useDroppable({ id: category });
  const item = itemId ? clothes.find((c) => c.id === itemId) : null;

  const itemTip = item ? smartTips.find((t) => t.itemId === item.id && t.removalReason) : null;
  const isForced = item ? forcedItems.has(item.id) : false;
  const weatherRemoval: WeatherRemoval | undefined = weatherRemovals[category];

  const handleKeepItem = () => {
    if (item) addForcedItem(item.id);
  };

  const handleUnkeepItem = () => {
    if (item) removeForcedItem(item.id);
  };

  const handleRestoreWeatherRemoval = () => {
    if (weatherRemoval) {
      addToCanvas(category, weatherRemoval.itemId);
      addForcedItem(weatherRemoval.itemId);
      clearWeatherRemoval(category);
    }
  };

  const weatherRemovalIcon = (reason: string) => {
    if (reason.includes('降温') || reason.includes('低温')) return Thermometer;
    if (reason.includes('阵雨') || reason.includes('雨')) return CloudRain;
    if (reason.includes('大风')) return Wind;
    if (reason.includes('强晒') || reason.includes('防晒')) return Sun;
    return AlertTriangle;
  };

  return (
    <div
      ref={setNodeRef}
      onClick={!item && !weatherRemoval ? onSelect : undefined}
      className={cn(
        'relative rounded-xl transition-all duration-300 overflow-hidden',
        item
          ? itemTip && !isForced
            ? 'bg-white border border-terracotta/30 shadow-card ring-1 ring-terracotta/10'
            : isForced
              ? 'bg-white border border-amber-300/50 shadow-card'
              : 'bg-white border border-sand/50 shadow-card'
          : weatherRemoval
            ? 'bg-amber-50/40 border border-amber-200/40 shadow-card'
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
                  {getWashStatusLabel(item.washStatus)}
                </span>
              </div>
            )}
            {isForced && (
              <div className="absolute top-0 right-0 rounded-bl-lg bg-amber-400 px-1 py-0.5">
                <span className="text-[8px] font-bold text-white">保留</span>
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
            {itemTip && !isForced && itemTip.removalReason && (
              <div className="mt-1.5 flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-terracotta shrink-0 mt-0.5" />
                <span className="text-[10px] text-terracotta leading-tight">{itemTip.removalReason}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeepItem();
                  }}
                  className="ml-auto shrink-0 rounded bg-terracotta/10 px-1.5 py-0.5 text-[9px] font-medium text-terracotta hover:bg-terracotta/20 transition-colors whitespace-nowrap"
                >
                  保留
                </button>
              </div>
            )}
            {isForced && itemTip && (
              <div className="mt-1.5 flex items-start gap-1">
                <Eye className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[10px] text-amber-600 leading-tight">已保留，舒适度可能受影响</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnkeepItem();
                  }}
                  className="ml-auto shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-600 hover:bg-amber-100 transition-colors whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromCanvas(category);
              if (isForced) removeForcedItem(item.id);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand/40 text-warm-gray/70 transition-all hover:bg-terracotta hover:text-white hover:shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : weatherRemoval ? (
        <div className="flex items-center gap-2.5 p-2.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-amber-100/60">
            {(() => {
              const WIcon = weatherRemovalIcon(weatherRemoval.reason);
              return <WIcon className="h-5 w-5 text-amber-500" />;
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-amber-700 leading-tight">
              已移除「{weatherRemoval.itemName}」
            </p>
            <p className="mt-0.5 text-[10px] text-amber-600/80 leading-tight">
              {weatherRemoval.reason}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreWeatherRemoval();
              }}
              className="mt-1.5 flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-1 text-[10px] font-medium text-amber-700 hover:bg-amber-200/80 transition-colors"
            >
              <Undo2 className="h-2.5 w-2.5" />
              保留此单品
            </button>
          </div>
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
