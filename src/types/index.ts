export type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'shoes_bag' | 'accessory';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WashStatus = 'clean' | 'washing' | 'drying';
export type SizeFit = 'fitted' | 'regular' | 'loose' | 'tight';
export type Occasion = 'commute' | 'date' | 'travel' | 'sport' | 'interview';
export type TipLevel = 'error' | 'warning' | 'info';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  photo: string;
  colors: string[];
  material: string;
  seasons: Season[];
  washStatus: WashStatus;
  sizeFit: SizeFit;
  lastWornDate: string | null;
  createdAt: string;
}

export interface OutfitPlan {
  id: string;
  items: string[];
  occasion: Occasion;
  date: string;
  createdAt: string;
}

export interface PackingItem {
  id: string;
  clothingId: string;
  packed: boolean;
}

export interface PackingList {
  id: string;
  name: string;
  items: PackingItem[];
  travelDates: [string, string];
}

export interface SavedOutfit {
  id: string;
  items: string[];
  occasion: Occasion;
  savedAt: string;
  name: string;
}

export interface SmartTip {
  id: string;
  level: TipLevel;
  type: 'temperature' | 'rain' | 'color_clash' | 'washing' | 'size_fit' | 'repeat_wear';
  message: string;
  itemId?: string;
}
