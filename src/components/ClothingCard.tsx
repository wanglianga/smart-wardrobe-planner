import { useDraggable } from '@dnd-kit/core';
import { Sun, Leaf, Snowflake, Flower, Droplets, Clock } from 'lucide-react';
import type { ClothingItem, Season } from '@/types';
import { cn } from '@/lib/utils';
import { parseISO, differenceInDays } from 'date-fns';

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: (id: string) => void;
  compact?: boolean;
}

const seasonIcons: Record<Season, React.ElementType> = {
  spring: Flower,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const seasonLabels: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

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

export default function ClothingCard({ item, onClick, compact }: ClothingCardProps) {
  const isUnavailable = item.washStatus === 'washing' || item.washStatus === 'drying';
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { category: item.category },
  });

  const daysSinceWorn = item.lastWornDate
    ? differenceInDays(new Date(), parseISO(item.lastWornDate))
    : null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onClick?.(item.id)}
      className={cn(
        'relative rounded-xl bg-white transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden font-body group',
        compact ? 'w-[84px]' : 'w-[140px]',
        isDragging ? 'opacity-40 scale-95 shadow-zone-hover' : 'shadow-card hover:shadow-zone-hover',
        isUnavailable && 'opacity-60'
      )}
    >
      <div className={cn('relative w-full overflow-hidden bg-light-warm/50', compact ? 'h-[84px]' : 'h-[140px]')}>
        <img
          src={item.photo}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30 backdrop-blur-[2px]">
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5">
              <Droplets className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] font-medium text-charcoal">
                {item.washStatus === 'washing' ? '清洗中' : '晾干中'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={cn('space-y-1', compact ? 'p-1.5' : 'p-2')}>
        <p className={cn('font-medium text-charcoal truncate leading-tight', compact ? 'text-[10px]' : 'text-xs')}>
          {item.name}
        </p>

        <div className="flex items-center gap-1">
          {item.colors.map((color) => (
            <span
              key={color}
              className="h-2 w-2 rounded-full border border-sand/60"
              style={{ backgroundColor: colorMap[color] || color }}
            />
          ))}
          {!compact && item.colors.length > 0 && (
            <span className="text-[9px] text-warm-gray/70 ml-0.5">{item.colors[0]}</span>
          )}
        </div>

        {!compact && (
          <div className="flex items-center justify-between">
            <span className="inline-block rounded bg-sand/30 px-1 py-0.5 text-[9px] text-warm-gray">
              {item.material}
            </span>
          </div>
        )}

        <div className="flex items-center gap-0.5">
          {item.seasons.map((season) => {
            const SeasonIcon = seasonIcons[season];
            return (
              <span
                key={season}
                className="flex items-center justify-center h-3.5 w-3.5 rounded bg-light-warm/60"
                title={seasonLabels[season]}
              >
                <SeasonIcon className="h-2 w-2 text-warm-gray/60" />
              </span>
            );
          })}
          {!compact && daysSinceWorn !== null && daysSinceWorn <= 3 && (
            <span className="flex items-center gap-0.5 ml-auto text-[9px] text-terracotta/70">
              <Clock className="h-2.5 w-2.5" />
              {daysSinceWorn === 0 ? '今天穿过' : `${daysSinceWorn}天前`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
