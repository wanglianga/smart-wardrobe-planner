import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ClothingCategory,
  Season,
  WashStatus,
  Occasion,
  ClothingItem,
  OutfitPlan,
  PackingList,
  SavedOutfit,
  SmartTip,
  WeatherState,
  CareReminder,
  WeatherRemoval,
} from '@/types';
import { clothingItems, savedOutfits, outfitPlans, packingLists } from '@/data/mockData';

interface WardrobeState {
  clothes: ClothingItem[];
  outfitCanvas: Record<ClothingCategory, string | null>;
  selectedOccasion: Occasion | null;
  smartTips: SmartTip[];
  outfitPlans: OutfitPlan[];
  savedOutfits: SavedOutfit[];
  packingLists: PackingList[];
  selectedDate: string;
  activeCategory: ClothingCategory;
  weather: WeatherState;
  forcedItems: Set<string>;
  careReminders: CareReminder[];
  weatherRemovals: Partial<Record<ClothingCategory, WeatherRemoval>>;
  filters: {
    colors: string[];
    materials: string[];
    seasons: Season[];
    washStatus: WashStatus | null;
    search: string;
  };

  setActiveCategory: (category: ClothingCategory) => void;
  setFilters: (filters: Partial<WardrobeState['filters']>) => void;
  resetFilters: () => void;
  addToCanvas: (category: ClothingCategory, itemId: string) => void;
  removeFromCanvas: (category: ClothingCategory) => void;
  clearCanvas: () => void;
  setSelectedOccasion: (occasion: Occasion | null) => void;
  setSmartTips: (tips: SmartTip[]) => void;
  setWeather: (weather: Partial<WeatherState>) => void;
  addOutfitPlan: (plan: Omit<OutfitPlan, 'id' | 'createdAt'>) => void;
  removeOutfitPlan: (id: string) => void;
  addSavedOutfit: (outfit: Omit<SavedOutfit, 'id' | 'savedAt'>) => void;
  removeSavedOutfit: (id: string) => void;
  addPackingList: (list: Omit<PackingList, 'id'>) => void;
  togglePackingItem: (listId: string, itemId: string) => void;
  setSelectedDate: (date: string) => void;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => void;
  addForcedItem: (itemId: string) => void;
  removeForcedItem: (itemId: string) => void;
  addCareReminder: (reminder: Omit<CareReminder, 'id'>) => void;
  removeCareReminder: (id: string) => void;
  setWeatherRemoval: (category: ClothingCategory, removal: WeatherRemoval) => void;
  clearWeatherRemoval: (category: ClothingCategory) => void;
  clearAllWeatherRemovals: () => void;
  getFilteredClothes: () => ClothingItem[];
  getCanvasItems: () => ClothingItem[];
}

const initialFilters: WardrobeState['filters'] = {
  colors: [],
  materials: [],
  seasons: [],
  washStatus: null,
  search: '',
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      clothes: clothingItems,
      outfitCanvas: {
        top: null,
        bottom: null,
        outerwear: null,
        shoes_bag: null,
        accessory: null,
      } as Record<ClothingCategory, string | null>,
      selectedOccasion: null,
      smartTips: [],
      outfitPlans: outfitPlans,
      savedOutfits: savedOutfits,
      packingLists: packingLists,
      selectedDate: new Date().toISOString().slice(0, 10),
      activeCategory: 'top' as ClothingCategory,
      weather: {
        tempHigh: 26,
        tempLow: 18,
        isRainy: false,
        isWindy: false,
        isStrongSun: false,
        isTempDrop: false,
      } as WeatherState,
      forcedItems: new Set<string>(),
      careReminders: [],
      weatherRemovals: {},
      filters: { ...initialFilters },

      setActiveCategory: (category) => set({ activeCategory: category }),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      resetFilters: () => set({ filters: { ...initialFilters } }),

      addToCanvas: (category, itemId) =>
        set((state) => ({
          outfitCanvas: { ...state.outfitCanvas, [category]: itemId },
        })),

      removeFromCanvas: (category) =>
        set((state) => ({
          outfitCanvas: { ...state.outfitCanvas, [category]: null },
        })),

      clearCanvas: () =>
        set({
          outfitCanvas: {
            top: null,
            bottom: null,
            outerwear: null,
            shoes_bag: null,
            accessory: null,
          },
        }),

      setSelectedOccasion: (occasion) =>
        set({ selectedOccasion: occasion }),

      setSmartTips: (tips) => set({ smartTips: tips }),

      setWeather: (weather) =>
        set((state) => ({ weather: { ...state.weather, ...weather } })),

      addOutfitPlan: (plan) =>
        set((state) => ({
          outfitPlans: [
            ...state.outfitPlans,
            {
              ...plan,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeOutfitPlan: (id) =>
        set((state) => ({
          outfitPlans: state.outfitPlans.filter((p) => p.id !== id),
        })),

      addSavedOutfit: (outfit) =>
        set((state) => ({
          savedOutfits: [
            ...state.savedOutfits,
            {
              ...outfit,
              id: crypto.randomUUID(),
              savedAt: new Date().toISOString(),
            },
          ],
        })),

      removeSavedOutfit: (id) =>
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.id !== id),
        })),

      addPackingList: (list) =>
        set((state) => ({
          packingLists: [
            ...state.packingLists,
            { ...list, id: crypto.randomUUID() },
          ],
        })),

      togglePackingItem: (listId, itemId) =>
        set((state) => ({
          packingLists: state.packingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId
                      ? { ...item, packed: !item.packed }
                      : item
                  ),
                }
              : list
          ),
        })),

      setSelectedDate: (date) => set({ selectedDate: date }),

      updateClothingItem: (id, updates) =>
        set((state) => ({
          clothes: state.clothes.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      addForcedItem: (itemId) =>
        set((state) => {
          const next = new Set(state.forcedItems);
          next.add(itemId);
          return { forcedItems: next };
        }),

      removeForcedItem: (itemId) =>
        set((state) => {
          const next = new Set(state.forcedItems);
          next.delete(itemId);
          return { forcedItems: next };
        }),

      addCareReminder: (reminder) =>
        set((state) => ({
          careReminders: [
            ...state.careReminders,
            { ...reminder, id: crypto.randomUUID() },
          ],
        })),

      removeCareReminder: (id) =>
        set((state) => ({
          careReminders: state.careReminders.filter((r) => r.id !== id),
        })),

      setWeatherRemoval: (category, removal) =>
        set((state) => ({
          weatherRemovals: { ...state.weatherRemovals, [category]: removal },
        })),

      clearWeatherRemoval: (category) =>
        set((state) => {
          const next = { ...state.weatherRemovals };
          delete next[category];
          return { weatherRemovals: next };
        }),

      clearAllWeatherRemovals: () => set({ weatherRemovals: {} }),

      getFilteredClothes: () => {
        const { clothes, activeCategory, filters } = get();
        return clothes.filter((item) => {
          if (item.category !== activeCategory) return false;
          if (filters.colors.length > 0 && !item.colors.some((c) => filters.colors.includes(c))) return false;
          if (filters.materials.length > 0 && !filters.materials.includes(item.material)) return false;
          if (filters.seasons.length > 0 && !item.seasons.some((s) => filters.seasons.includes(s))) return false;
          if (filters.washStatus && item.washStatus !== filters.washStatus) return false;
          if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
          return true;
        });
      },

      getCanvasItems: () => {
        const { clothes, outfitCanvas } = get();
        const ids = Object.values(outfitCanvas).filter((id): id is string => id !== null);
        return ids.map((id) => clothes.find((item) => item.id === id)).filter((item): item is ClothingItem => item !== undefined);
      },
    }),
    {
      name: 'wardrobe-store',
      partialize: (state) => ({
        clothes: state.clothes,
        outfitCanvas: state.outfitCanvas,
        selectedOccasion: state.selectedOccasion,
        outfitPlans: state.outfitPlans,
        savedOutfits: state.savedOutfits,
        packingLists: state.packingLists,
        selectedDate: state.selectedDate,
        weather: state.weather,
        forcedItems: [...state.forcedItems],
        careReminders: state.careReminders,
        weatherRemovals: state.weatherRemovals,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<WardrobeState>;
        return {
          ...current,
          ...p,
          forcedItems: new Set(p.forcedItems as unknown as string[]),
          weather: { ...current.weather, ...(p.weather || {}) },
        };
      },
    }
  )
);
