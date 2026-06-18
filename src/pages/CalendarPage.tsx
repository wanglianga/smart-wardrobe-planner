import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';
import type { Occasion } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import CalendarView from '@/components/CalendarView';
import PackingListPanel from '@/components/PackingListPanel';
import OutfitHistory from '@/components/OutfitHistory';

const OCCASION_LABELS: Record<Occasion, string> = {
  commute: '通勤',
  date: '约会',
  travel: '旅行',
  sport: '运动',
  interview: '面试',
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const selectedDate = useWardrobeStore((s) => s.selectedDate);
  const outfitPlans = useWardrobeStore((s) => s.outfitPlans);
  const clothes = useWardrobeStore((s) => s.clothes);

  const selectedPlan = outfitPlans.find((p) => p.date === selectedDate);
  const planItems = selectedPlan
    ? selectedPlan.items
        .map((id) => clothes.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => c !== undefined)
    : [];

  return (
    <div className="min-h-screen bg-ivory font-body">
      <header className="flex items-center gap-2.5 px-5 py-4 bg-ivory border-b border-sand/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta/10">
          <CalendarDays className="h-4 w-4 text-terracotta" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-charcoal leading-tight">日历与计划</h1>
          <p className="text-[10px] text-warm-gray">安排穿搭到具体日期</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 px-4 pb-6">
        <div className="space-y-4">
          <div className="zone-section">
            <CalendarView />
          </div>

          <div className="zone-section">
            <div className="zone-header">
              <div className="zone-header-icon">
                <CalendarDays className="h-3.5 w-3.5 text-terracotta" />
              </div>
              <div>
                <h3 className="zone-title">{selectedDate} 穿搭计划</h3>
              </div>
            </div>

            {selectedPlan ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[11px] font-medium text-terracotta-dark">
                    {OCCASION_LABELS[selectedPlan.occasion]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {planItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 rounded-lg border border-sand/40 bg-ivory/60 px-2 py-1.5">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-7 w-7 rounded-md object-cover"
                      />
                      <span className="text-[11px] font-medium text-charcoal">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-warm-gray">
                <CalendarDays className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-[11px]">当日无穿搭计划</p>
                <button
                  onClick={() => navigate('/outfit')}
                  className="mt-2.5 flex items-center gap-1 rounded-full bg-terracotta px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-terracotta-dark"
                >
                  <Plus className="h-3 w-3" />
                  创建搭配
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="zone-section">
            <PackingListPanel />
          </div>
          <div className="zone-section">
            <OutfitHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
