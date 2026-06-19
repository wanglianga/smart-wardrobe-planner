import { Thermometer, CloudRain, Sun, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { cn } from '@/lib/utils';

export default function WeatherPanel() {
  const weather = useWardrobeStore((s) => s.weather);
  const setWeather = useWardrobeStore((s) => s.setWeather);

  const tempDiff = weather.tempHigh - weather.tempLow;
  const hasLargeDiff = tempDiff > 12;
  const activeConditions = [weather.isRainy, weather.isWindy, weather.isStrongSun, weather.isTempDrop].filter(Boolean).length;

  return (
    <div className="zone-section !p-0 overflow-hidden">
      <div className="zone-header mx-4 mt-4 mb-0">
        <div className="zone-header-icon">
          <Thermometer className="h-3.5 w-3.5 text-terracotta" />
        </div>
        <div className="flex-1">
          <h3 className="zone-title">天气状况</h3>
        </div>
        {activeConditions > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-white">
            {activeConditions}
          </span>
        )}
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-ivory/60 p-3 border border-sand/30">
          <div className="flex flex-col items-center gap-0.5">
            {weather.isRainy ? (
              <CloudRain className="h-7 w-7 text-blue-400" />
            ) : weather.isStrongSun ? (
              <Sun className="h-7 w-7 text-amber-400" />
            ) : (
              <Sun className="h-7 w-7 text-amber-400" />
            )}
            <span className="text-[10px] text-warm-gray">
              {weather.isRainy ? '雨天' : weather.isStrongSun ? '强晒' : '晴'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-bold text-charcoal leading-none">
              {weather.tempHigh}°
            </span>
            <span className="text-[10px] text-warm-gray">最高</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-bold text-warm-gray leading-none">
              {weather.tempLow}°
            </span>
            <span className="text-[10px] text-warm-gray">最低</span>
          </div>
        </div>

        {(weather.isTempDrop || hasLargeDiff) && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 border border-amber-200/50 animate-fade-in">
            <Thermometer className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] text-amber-700">
              {weather.isTempDrop ? '今日降温，注意保暖' : `温差${tempDiff}°C，建议叠穿方便增减`}
            </span>
          </div>
        )}

        {weather.isWindy && (
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 border border-blue-200/50 animate-fade-in">
            <Wind className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="text-[11px] text-blue-700">大风天气，注意防风</span>
          </div>
        )}

        {weather.isStrongSun && (
          <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1.5 border border-orange-200/50 animate-fade-in">
            <Sun className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span className="text-[11px] text-orange-700">强晒天气，注意防晒</span>
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <label className="w-7 text-[11px] text-warm-gray shrink-0">高温</label>
            <div className="flex-1 relative">
              <input
                type="range"
                min={-10}
                max={45}
                value={weather.tempHigh}
                onChange={(e) => setWeather({ tempHigh: Number(e.target.value) })}
                className="w-full h-1.5 bg-sand rounded-full appearance-none cursor-pointer"
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-charcoal">{weather.tempHigh}°</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-7 text-[11px] text-warm-gray shrink-0">低温</label>
            <div className="flex-1 relative">
              <input
                type="range"
                min={-20}
                max={35}
                value={weather.tempLow}
                onChange={(e) => setWeather({ tempLow: Number(e.target.value) })}
                className="w-full h-1.5 bg-sand rounded-full appearance-none cursor-pointer"
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-charcoal">{weather.tempLow}°</span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-sand/30">
            <Droplets className="h-3.5 w-3.5 text-warm-gray shrink-0" />
            <span className="text-[11px] text-warm-gray">阵雨</span>
            <button
              onClick={() => setWeather({ isRainy: !weather.isRainy })}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors ml-auto',
                weather.isRainy ? 'bg-blue-400' : 'bg-sand'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  weather.isRainy ? 'left-[18px]' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-3.5 w-3.5 text-warm-gray shrink-0" />
            <span className="text-[11px] text-warm-gray">大风</span>
            <button
              onClick={() => setWeather({ isWindy: !weather.isWindy })}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors ml-auto',
                weather.isWindy ? 'bg-blue-400' : 'bg-sand'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  weather.isWindy ? 'left-[18px]' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5 text-warm-gray shrink-0" />
            <span className="text-[11px] text-warm-gray">强晒</span>
            <button
              onClick={() => setWeather({ isStrongSun: !weather.isStrongSun })}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors ml-auto',
                weather.isStrongSun ? 'bg-orange-400' : 'bg-sand'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  weather.isStrongSun ? 'left-[18px]' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warm-gray shrink-0" />
            <span className="text-[11px] text-warm-gray">降温</span>
            <button
              onClick={() => setWeather({ isTempDrop: !weather.isTempDrop })}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors ml-auto',
                weather.isTempDrop ? 'bg-amber-400' : 'bg-sand'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  weather.isTempDrop ? 'left-[18px]' : 'left-0.5'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
