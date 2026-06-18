import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Save, CalendarPlus, Trash2, Sparkles, Calendar, Luggage, ChevronDown, ChevronUp, Shirt } from 'lucide-react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { ClothingCategory } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { generateSmartTips } from '@/utils/smartTips';
import CategoryNav from '@/components/CategoryNav';
import ClothingCard from '@/components/ClothingCard';
import OutfitCanvas from '@/components/OutfitCanvas';
import OccasionSelector from '@/components/OccasionSelector';
import WeatherPanel from '@/components/WeatherPanel';
import SmartTips from '@/components/SmartTips';
import ReplacementSuggestions from '@/components/ReplacementSuggestions';
import CalendarView from '@/components/CalendarView';
import PackingListPanel from '@/components/PackingListPanel';

export default function OutfitPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPacking, setShowPacking] = useState(false);

  const clothes = useWardrobeStore((s) => s.clothes);
  const activeCategory = useWardrobeStore((s) => s.activeCategory);
  const outfitCanvas = useWardrobeStore((s) => s.outfitCanvas);
  const selectedOccasion = useWardrobeStore((s) => s.selectedOccasion);
  const weather = useWardrobeStore((s) => s.weather);
  const smartTips = useWardrobeStore((s) => s.smartTips);
  const addToCanvas = useWardrobeStore((s) => s.addToCanvas);
  const clearCanvas = useWardrobeStore((s) => s.clearCanvas);
  const addSavedOutfit = useWardrobeStore((s) => s.addSavedOutfit);
  const addOutfitPlan = useWardrobeStore((s) => s.addOutfitPlan);
  const setSmartTips = useWardrobeStore((s) => s.setSmartTips);

  const filteredClothes = useMemo(
    () => clothes.filter((item) => item.category === activeCategory),
    [clothes, activeCategory]
  );

  const canvasItems = useMemo(() => {
    const ids = Object.values(outfitCanvas).filter((id): id is string => id !== null);
    return ids.map((id) => clothes.find((item) => item.id === id)).filter((item) => item !== undefined);
  }, [outfitCanvas, clothes]);

  useEffect(() => {
    const tips = generateSmartTips(canvasItems as NonNullable<typeof canvasItems>[number][], selectedOccasion, weather);
    setSmartTips(tips);
  }, [canvasItems, selectedOccasion, weather, setSmartTips]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const itemId = String(active.id);
    const item = clothes.find((c) => c.id === itemId);
    if (!item) return;
    const overId = String(over.id);
    const categories: ClothingCategory[] = ['top', 'bottom', 'outerwear', 'shoes_bag', 'accessory'];
    if (categories.includes(overId as ClothingCategory)) {
      addToCanvas(overId as ClothingCategory, itemId);
    }
  };

  const handleCardClick = useCallback((id: string) => {
    const item = clothes.find((c) => c.id === id);
    if (item) {
      addToCanvas(item.category, item.id);
    }
  }, [clothes, addToCanvas]);

  const handleSave = () => {
    const itemIds = Object.values(outfitCanvas).filter((id): id is string => id !== null);
    if (itemIds.length === 0) return;
    addSavedOutfit({
      items: itemIds,
      occasion: selectedOccasion ?? 'commute',
      name: `搭配 ${new Date().toLocaleDateString('zh-CN')}`,
    });
  };

  const handlePlan = () => {
    const itemIds = Object.values(outfitCanvas).filter((id): id is string => id !== null);
    if (itemIds.length === 0) return;
    addOutfitPlan({
      items: itemIds,
      occasion: selectedOccasion ?? 'commute',
      date: useWardrobeStore.getState().selectedDate,
    });
    navigate('/calendar');
  };

  const activeItem = activeId ? clothes.find((c) => c.id === activeId) : null;

  return (
    <div className="min-h-screen bg-ivory font-body">
      <header className="flex items-center justify-between px-5 py-3.5 bg-ivory border-b border-sand/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta/10">
            <Sparkles className="h-4 w-4 text-terracotta" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-charcoal leading-tight">搭配规划</h1>
            <p className="text-[10px] text-warm-gray">拖拽衣物到画布 · 选择场合获取建议</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-1 rounded-lg border border-sand/50 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-charcoal transition-colors hover:border-terracotta/50 hover:text-terracotta"
          >
            <Calendar className="h-3 w-3" />
            日历
            {showCalendar ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
          </button>
          <button
            onClick={() => setShowPacking(!showPacking)}
            className="flex items-center gap-1 rounded-lg border border-sand/50 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-charcoal transition-colors hover:border-terracotta/50 hover:text-terracotta"
          >
            <Luggage className="h-3 w-3" />
            行李
            {showPacking ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
          </button>
        </div>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr_260px] lg:gap-3 lg:p-3">
          <aside className="lg:order-1 order-2 border-t lg:border-t-0 lg:border-r border-sand/30 bg-white/30 lg:bg-transparent">
            <div className="lg:sticky lg:top-3 flex flex-col h-full">
              <div className="px-3 pt-3 pb-1 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="zone-header-icon">
                    <Shirt className="h-3.5 w-3.5 text-terracotta" />
                  </div>
                  <h2 className="zone-title">衣橱衣柜</h2>
                </div>
              </div>
              <CategoryNav />
              <div className="flex-1 overflow-y-auto px-2 py-2 lg:max-h-[calc(100vh-200px)]">
                <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5 justify-items-center">
                  {filteredClothes.map((item) => (
                    <ClothingCard key={item.id} item={item} onClick={handleCardClick} compact />
                  ))}
                </div>
                {filteredClothes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-warm-gray">
                    <p className="text-[11px]">该分类暂无衣物</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:order-2 order-1 flex flex-col gap-3 p-3 lg:p-0">
            <OutfitCanvas />
            <OccasionSelector />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-terracotta py-2.5 text-xs font-medium text-white transition-all hover:bg-terracotta-dark hover:shadow-zone active:scale-[0.98]"
              >
                <Save className="h-3.5 w-3.5" />
                保存搭配
              </button>
              <button
                onClick={handlePlan}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-charcoal py-2.5 text-xs font-medium text-white transition-all hover:bg-charcoal/80 hover:shadow-zone active:scale-[0.98]"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                安排到日历
              </button>
              <button
                onClick={clearCanvas}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-sand/50 bg-white/80 px-3 py-2.5 text-xs font-medium text-warm-gray transition-all hover:border-terracotta/50 hover:text-terracotta active:scale-[0.98]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {(showCalendar || showPacking) && (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 animate-slide-up">
                {showCalendar && (
                  <div className="zone-section">
                    <CalendarView />
                  </div>
                )}
                {showPacking && (
                  <div className="zone-section">
                    <PackingListPanel />
                  </div>
                )}
              </div>
            )}
          </main>

          <aside className="lg:order-3 order-3 border-t lg:border-t-0 lg:border-l border-sand/30 bg-white/30 lg:bg-transparent p-3 lg:p-0">
            <div className="lg:sticky lg:top-3 space-y-3">
              <div className="hidden lg:block px-1 pb-1">
                <div className="flex items-center gap-2">
                  <div className="zone-header-icon">
                    <Sparkles className="h-3 w-3 text-terracotta" />
                  </div>
                  <h2 className="zone-title">穿搭助手</h2>
                </div>
              </div>
              <WeatherPanel />
              <SmartTips />
              <ReplacementSuggestions tips={smartTips} />
            </div>
          </aside>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="opacity-80 rotate-3 scale-105 transition-transform">
              <ClothingCard item={activeItem} compact />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
