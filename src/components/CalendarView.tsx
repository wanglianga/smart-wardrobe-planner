import { useState } from 'react';
import { ChevronLeft, ChevronRight, Shirt } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  getDay,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useWardrobeStore } from '@/store/useWardrobeStore';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { outfitPlans, selectedDate, setSelectedDate } = useWardrobeStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDay = getDay(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const planDates = outfitPlans.map((p) => parseISO(p.date));
  const selectedDateParsed = parseISO(selectedDate);

  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }
  daysInMonth.forEach((d) => calendarCells.push(d));

  const hasPlan = (day: Date) => planDates.some((pd) => isSameDay(pd, day));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-light-warm/60 transition-colors text-charcoal"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-body font-semibold text-charcoal text-sm">
          {format(currentMonth, 'yyyy年M月', { locale: zhCN })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-light-warm/60 transition-colors text-charcoal"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[10px] font-medium text-warm-gray/60 py-1.5"
          >
            {wd}
          </div>
        ))}

        {calendarCells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dayStr = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, selectedDateParsed);
          const isTodayDate = isToday(day);
          const planned = hasPlan(day);

          return (
            <button
              key={dayStr}
              onClick={() => setSelectedDate(dayStr)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-colors relative',
                isSelected
                  ? 'bg-terracotta text-white font-semibold'
                  : isTodayDate
                    ? 'bg-terracotta/8 text-charcoal font-semibold'
                    : 'text-charcoal hover:bg-light-warm/60'
              )}
            >
              <span>{format(day, 'd')}</span>
              {planned && !isSelected && (
                <Shirt
                  size={8}
                  className="absolute bottom-0.5 text-terracotta"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
