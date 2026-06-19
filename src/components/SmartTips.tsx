import { AlertTriangle, Info, CheckCircle, Thermometer, CloudRain, Palette, Droplets, Ruler, Repeat, Wind, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SmartTip, TipLevel } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';

const levelStyles: Record<TipLevel, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
  error: { bg: 'bg-red-50/60', border: 'border-l-red-500', icon: AlertTriangle, iconColor: 'text-red-500' },
  warning: { bg: 'bg-amber-50/50', border: 'border-l-terracotta', icon: AlertTriangle, iconColor: 'text-terracotta' },
  info: { bg: 'bg-blue-50/40', border: 'border-l-blue-400', icon: Info, iconColor: 'text-blue-400' },
};

const typeIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  rain: CloudRain,
  wind: Wind,
  sun: Sun,
  color_clash: Palette,
  washing: Droplets,
  care_status: Droplets,
  size_fit: Ruler,
  repeat_wear: Repeat,
};

function TipRow({ tip, itemName }: { tip: SmartTip; itemName?: string }) {
  const style = levelStyles[tip.level];
  const TypeIcon = typeIcons[tip.type] || Info;

  return (
    <div className={cn('flex items-start gap-2 border-l-[3px] rounded-r-lg px-2.5 py-2 animate-slide-in-right', style.bg, style.border)}>
      <TypeIcon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', style.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-charcoal leading-relaxed">{tip.message}</p>
        {itemName && (
          <span className="mt-0.5 inline-block text-[10px] font-medium text-terracotta bg-terracotta/8 px-1.5 py-0.5 rounded">
            {itemName}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SmartTips() {
  const smartTips = useWardrobeStore((s) => s.smartTips);
  const clothes = useWardrobeStore((s) => s.clothes);

  return (
    <div className="zone-section !p-0 overflow-hidden">
      <div className="zone-header mx-4 mt-4 mb-0">
        <div className="zone-header-icon">
          <AlertTriangle className="h-3 w-3 text-terracotta" />
        </div>
        <div className="flex-1">
          <h3 className="zone-title">穿搭提示</h3>
        </div>
        {smartTips.length > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-white">
            {smartTips.length}
          </span>
        )}
      </div>
      <div className="p-3">
        {smartTips.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-4 text-warm-gray">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-[11px]">当前搭配无问题</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {smartTips.map((tip) => {
              const item = tip.itemId ? clothes.find((c) => c.id === tip.itemId) : undefined;
              return <TipRow key={tip.id} tip={tip} itemName={item?.name} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
