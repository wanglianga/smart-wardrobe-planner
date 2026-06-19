export type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'shoes_bag' | 'accessory';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WashStatus = 'clean' | 'washing' | 'drying' | 'ironing' | 'dry_cleaning' | 'lent_out';
export type SizeFit = 'fitted' | 'regular' | 'loose' | 'tight';
export type Occasion = 'commute' | 'date' | 'travel' | 'sport' | 'interview';
export type TipLevel = 'error' | 'warning' | 'info';

export type CareStatusLabel = '待洗' | '晾干中' | '熨烫中' | '送洗中' | '已借出';

export const WASH_STATUS_LABELS: Record<Exclude<WashStatus, 'clean'>, CareStatusLabel> = {
  washing: '待洗',
  drying: '晾干中',
  ironing: '熨烫中',
  dry_cleaning: '送洗中',
  lent_out: '已借出',
};

export interface WeatherState {
  tempHigh: number;
  tempLow: number;
  isRainy: boolean;
  isWindy: boolean;
  isStrongSun: boolean;
  isTempDrop: boolean;
}

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
  type: 'temperature' | 'rain' | 'wind' | 'sun' | 'color_clash' | 'washing' | 'care_status' | 'size_fit' | 'repeat_wear';
  message: string;
  itemId?: string;
  removalReason?: string;
}

export interface CareReminder {
  id: string;
  clothingId: string;
  clothingName: string;
  careStatus: Exclude<WashStatus, 'clean'>;
  date: string;
  note: string;
}

export interface WeatherRemoval {
  itemId: string;
  itemName: string;
  reason: string;
}

export interface AlternativeWithReasons {
  item: ClothingItem;
  matchReasons: string[];
}
