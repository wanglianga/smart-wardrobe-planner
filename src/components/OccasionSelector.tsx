import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Occasion } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';

const occasions: { id: Occasion; label: string; emoji: string }[] = [
  { id: 'commute', label: '通勤', emoji: '💼' },
  { id: 'date', label: '约会', emoji: '💕' },
  { id: 'travel', label: '旅行', emoji: '✈️' },
  { id: 'sport', label: '运动', emoji: '🏃' },
  { id: 'interview', label: '面试', emoji: '🎯' },
];

export default function OccasionSelector() {
  const selectedOccasion = useWardrobeStore((s) => s.selectedOccasion);
  const setSelectedOccasion = useWardrobeStore((s) => s.setSelectedOccasion);

  return (
    <div className="zone-section">
      <div className="zone-header">
        <div className="zone-header-icon">
          <Briefcase className="h-3.5 w-3.5 text-terracotta" />
        </div>
        <div>
          <h3 className="zone-title">选择场合</h3>
          <p className="zone-subtitle">不同场合有不同穿搭建议</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {occasions.map(({ id, label, emoji }) => {
          const isSelected = selectedOccasion === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedOccasion(isSelected ? null : id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-medium transition-all duration-200',
                isSelected
                  ? 'bg-terracotta text-white shadow-zone scale-[1.02]'
                  : 'bg-ivory/60 text-warm-gray hover:bg-light-warm hover:text-charcoal border border-sand/30'
              )}
            >
              <span className={cn(
                'text-base transition-transform duration-200',
                isSelected ? 'scale-110' : ''
              )}>
                {emoji}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
