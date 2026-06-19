import { useState } from 'react';
import { ChevronLeft, ChevronRight, Shirt, Bell } from 'lucide-react';
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
import type { CareReminder } from '@/types';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { outfitPlans, selectedDate, setSelectedDate, careReminders } = useWardrobeStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDay = getDay(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const planDates = outfitPlans.map((p) => parseISO(p.date));
  const selectedDateParsed = parseISO(selectedDate);

  const reminderDates = careReminders.map((r) => parseISO(r.date));
  const remindersByDate = careReminders.reduce<Record<string, CareReminder[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }
  daysInMonth.forEach((d) => calendarCells.push(d));

  const hasPlan = (day: Date) => planDates.some((pd) => isSameDay(pd, day));
  const hasReminder = (day: Date) => reminderDates.some((rd) => isSameDay(rd, day));

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
          const reminded = hasReminder(day);
          const dayReminders = remindersByDate[dayStr];

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
              <div className="absolute bottom-0.5 flex items-center gap-0.5">
                {planned && !isSelected && (
                  <Shirt size={6} className="text-terracotta" />
                )}
                {reminded && !isSelected && (
                  <Bell size={6} className="text-amber-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {careReminders.length > 0 && (
        <div className="mt-3 pt-3 border-t border-sand/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Bell className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-medium text-charcoal">洗护提醒</span>
          </div>
          <div className="space-y-1.5">
            {careReminders.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-start gap-1.5 rounded-lg bg-amber-50/50 px-2 py-1.5 border border-amber-200/30">
                <Bell className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-charcoal leading-tight">{r.note}</p>
                  <p className="text-[9px] text-warm-gray mt-0.5">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
