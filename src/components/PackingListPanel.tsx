import { Luggage, PackageOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWardrobeStore } from '@/store/useWardrobeStore';

export default function PackingListPanel() {
  const { packingLists, clothes, togglePackingItem } = useWardrobeStore();

  return (
    <div>
      <div className="zone-header">
        <div className="zone-header-icon">
          <Luggage className="h-3.5 w-3.5 text-terracotta" />
        </div>
        <div>
          <h3 className="zone-title">行李清单</h3>
        </div>
      </div>

      {packingLists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-warm-gray">
          <PackageOpen size={32} className="mb-2 opacity-30" />
          <p className="text-[11px]">暂无行李清单</p>
        </div>
      )}

      <div className="space-y-3">
        {packingLists.map((list) => {
          const packedCount = list.items.filter((i) => i.packed).length;
          const totalCount = list.items.length;
          const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

          return (
            <div key={list.id} className="border border-sand/40 rounded-lg p-3 bg-ivory/40">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-body font-semibold text-charcoal text-xs">
                  {list.name}
                </h4>
                <span className="text-[10px] text-warm-gray">
                  {packedCount}/{totalCount}
                </span>
              </div>

              <p className="text-[10px] text-warm-gray mb-2">
                {format(parseISO(list.travelDates[0]), 'M月d日')} -{' '}
                {format(parseISO(list.travelDates[1]), 'M月d日')}
              </p>

              <div className="w-full h-1 bg-light-warm/60 rounded-full mb-2.5 overflow-hidden">
                <div
                  className="h-full bg-terracotta rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <ul className="space-y-1.5">
                {list.items.map((item) => {
                  const clothing = clothes.find((c) => c.id === item.clothingId);
                  if (!clothing) return null;

                  return (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        onClick={() => togglePackingItem(list.id, item.id)}
                        className={cn(
                          'w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors',
                          item.packed
                            ? 'bg-terracotta border-terracotta'
                            : 'border-sand/60 hover:border-terracotta/50'
                        )}
                      >
                        {item.packed && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-2 h-2 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        )}
                      </button>
                      <img
                        src={clothing.photo}
                        alt={clothing.name}
                        className="w-6 h-6 rounded object-cover flex-shrink-0"
                      />
                      <span
                        className={cn(
                          'text-[11px] truncate',
                          item.packed
                            ? 'text-warm-gray/60 line-through'
                            : 'text-charcoal'
                        )}
                      >
                        {clothing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
