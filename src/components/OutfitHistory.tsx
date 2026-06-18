import { Clock } from 'lucide-react';
import { format, parseISO, compareDesc } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import type { Occasion } from '@/types';

const OCCASION_LABELS: Record<Occasion, string> = {
  commute: '通勤',
  date: '约会',
  travel: '旅行',
  sport: '运动',
  interview: '面试',
};

export default function OutfitHistory() {
  const { outfitPlans, clothes } = useWardrobeStore();

  const sorted = [...outfitPlans]
    .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))
    .slice(0, 10);

  return (
    <div>
      <div className="zone-header">
        <div className="zone-header-icon">
          <Clock className="h-3.5 w-3.5 text-terracotta" />
        </div>
        <div>
          <h3 className="zone-title">穿搭历史</h3>
        </div>
      </div>

      {sorted.length === 0 && (
        <p className="text-[11px] text-warm-gray text-center py-4">暂无穿搭记录</p>
      )}

      <div className="relative">
        <div className="absolute left-[30px] top-2 bottom-2 w-px bg-sand/50" />

        <div className="space-y-3">
          {sorted.map((plan) => {
            const planItems = plan.items
              .map((id) => clothes.find((c) => c.id === id))
              .filter((c): c is NonNullable<typeof c> => c !== undefined);

            return (
              <div key={plan.id} className="relative flex items-start gap-2.5">
                <div className="flex flex-col items-center flex-shrink-0 w-[30px]">
                  <div className="w-2 h-2 rounded-full bg-terracotta z-10" />
                  <div className="text-[9px] text-warm-gray/60 mt-1 text-center leading-tight">
                    {format(parseISO(plan.date), 'M/d')}
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-2 pb-0.5">
                  <div className="flex -space-x-1 overflow-hidden">
                    {planItems.map((item) => (
                      <img
                        key={item.id}
                        src={item.photo}
                        alt={item.name}
                        className="w-7 h-7 rounded-md object-cover border-2 border-white flex-shrink-0"
                      />
                    ))}
                  </div>

                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0',
                      'bg-terracotta/10 text-terracotta-dark'
                    )}
                  >
                    {OCCASION_LABELS[plan.occasion]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
