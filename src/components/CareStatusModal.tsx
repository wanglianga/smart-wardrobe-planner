import { X, Info, Droplets, Bell } from 'lucide-react';
import type { ClothingItem, WashStatus, ClothingCategory } from '@/types';
import { WASH_STATUS_LABELS } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { findAlternatives } from '@/utils/smartTips';
import { cn } from '@/lib/utils';

interface CareStatusModalProps {
  item: ClothingItem;
  targetCategory: ClothingCategory;
  onConfirm: () => void;
  onCancel: () => void;
}

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

export default function CareStatusModal({ item, targetCategory, onConfirm, onCancel }: CareStatusModalProps) {
  const clothes = useWardrobeStore((s) => s.clothes);
  const outfitCanvas = useWardrobeStore((s) => s.outfitCanvas);
  const addToCanvas = useWardrobeStore((s) => s.addToCanvas);

  const statusLabel = WASH_STATUS_LABELS[item.washStatus as Exclude<WashStatus, 'clean'>];
  const canvasIds = new Set(Object.values(outfitCanvas).filter((id): id is string => id !== null));
  const alternatives = findAlternatives(item, clothes, canvasIds);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/30 backdrop-blur-[2px] animate-fade-in" onClick={onCancel}>
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white shadow-xl animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-sand/20">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <Info className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-charcoal">衣物状态提示</h3>
          </div>
          <button
            onClick={onCancel}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-sand/40 text-warm-gray/70 hover:bg-sand/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-blue-50/40 p-3 border border-blue-100/60">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <img src={item.photo} alt={item.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20 backdrop-blur-[1px]">
                <Droplets className="h-4 w-4 text-white/90" />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium text-charcoal">{item.name}</p>
              <p className="text-[11px] text-blue-500 mt-0.5">
                当前状态：<span className="font-medium">{statusLabel}</span>
              </p>
            </div>
          </div>

          {alternatives.length > 0 && (
            <div>
              <p className="text-[12px] font-medium text-charcoal mb-2">相近替代品推荐</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {alternatives.map((alt) => (
                  <button
                    key={alt.item.id}
                    onClick={() => addToCanvas(targetCategory, alt.item.id)}
                    className="flex w-[90px] shrink-0 flex-col items-center gap-1 rounded-xl border border-sand/40 bg-white p-1.5 shadow-card transition-all hover:border-terracotta/40 hover:shadow-zone active:scale-[0.97]"
                  >
                    <img src={alt.item.photo} alt={alt.item.name} className="h-14 w-14 rounded-lg object-cover" />
                    <p className="w-full truncate text-center text-[10px] font-medium text-charcoal">{alt.item.name}</p>
                    <div className="flex items-center gap-0.5 flex-wrap justify-center">
                      {alt.item.colors.slice(0, 3).map((color) => (
                        <span
                          key={color}
                          className="h-2 w-2 rounded-full border border-sand/50"
                          style={{ backgroundColor: colorMap[color] || color }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-0.5 flex-wrap justify-center">
                      {alt.matchReasons.map((reason) => (
                        <span
                          key={reason}
                          className={cn(
                            'text-[7px] px-1 py-0.5 rounded',
                            reason === '颜色相近' ? 'bg-pink-50 text-pink-400' :
                            reason === '版型相似' ? 'bg-blue-50 text-blue-400' :
                            'bg-green-50 text-green-400'
                          )}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-sand/50 bg-white/80 px-3 py-2.5 text-xs font-medium text-warm-gray transition-all hover:bg-sand/30 active:scale-[0.98]"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-blue-400 px-3 py-2.5 text-xs font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
              仍然使用
            </button>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Bell className="h-3 w-3 text-warm-gray/50" />
            <p className="text-[10px] text-warm-gray/60">确认使用后，日历将添加提醒标记</p>
          </div>
        </div>
      </div>
    </div>
  );
}
