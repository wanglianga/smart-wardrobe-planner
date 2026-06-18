import type { ClothingItem, Occasion, SmartTip } from '@/types';

const HEAVY_MATERIALS = ['wool', 'cashmere', 'leather', '羊毛', '羊绒', '皮革'];
const RAIN_SENSITIVE_MATERIALS = ['suede', 'canvas', '麂皮', '帆布'];

const COLOR_GROUPS: Record<string, string[]> = {
  red: ['red', '红色', 'scarlet', 'crimson', '酒红'],
  green: ['green', '绿色', 'olive', 'lime', '军绿'],
  orange: ['orange', '橙色', 'coral', 'peach', '橘色'],
  pink: ['pink', '粉色', 'hot_pink', 'rose', 'magenta', 'fuchsia', '玫红'],
  neon: ['neon_green', 'neon_pink', 'neon_orange', '荧光绿', '荧光粉', '荧光橙', '荧光'],
};

const CLASH_PAIRS: [string, string][] = [
  ['red', 'green'],
  ['orange', 'pink'],
];

function getColorGroup(color: string): string | null {
  const lower = color.toLowerCase();
  for (const [group, colors] of Object.entries(COLOR_GROUPS)) {
    if (colors.some((c) => lower.includes(c.toLowerCase()))) {
      return group;
    }
  }
  return null;
}

function isWithinLast3Days(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

export function generateSmartTips(
  items: ClothingItem[],
  occasion: Occasion | null,
  weather: { tempHigh: number; tempLow: number; isRainy: boolean }
): SmartTip[] {
  const tips: SmartTip[] = [];
  let idx = 0;

  for (const item of items) {
    if (weather.tempHigh > 28) {
      const isHeavy = HEAVY_MATERIALS.some((m) =>
        item.material.toLowerCase().includes(m.toLowerCase())
      );
      if (isHeavy) {
        tips.push({
          id: `tip-temperature-${item.id}`,
          level: 'warning',
          type: 'temperature',
          message: `气温较高（最高${weather.tempHigh}°C），「${item.name}」材质偏厚重，建议更换轻薄衣物`,
          itemId: item.id,
        });
        idx++;
      }
    }
  }

  if (weather.tempLow < 10) {
    const hasOuterwear = items.some((item) => item.category === 'outerwear');
    if (!hasOuterwear) {
      tips.push({
        id: `tip-temperature-${idx}`,
        level: 'warning',
        type: 'temperature',
        message: `气温较低（最低${weather.tempLow}°C），未选择外套，建议添加保暖外层`,
      });
      idx++;
    }
  }

  if (weather.tempHigh - weather.tempLow > 12) {
    tips.push({
      id: `tip-temperature-${idx}`,
      level: 'info',
      type: 'temperature',
      message: `今日温差较大（${weather.tempLow}°C ~ ${weather.tempHigh}°C），建议采用叠穿搭配方便增减`,
    });
    idx++;
  }

  if (weather.isRainy) {
    for (const item of items) {
      if (item.category === 'shoes_bag') {
        const isSensitive = RAIN_SENSITIVE_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (isSensitive) {
          tips.push({
            id: `tip-rain-${item.id}`,
            level: 'warning',
            type: 'rain',
            message: `雨天不宜穿「${item.name}」（${item.material}材质易受损），建议更换防水鞋款`,
            itemId: item.id,
          });
          idx++;
        }
      }
    }

    const hasUmbrella = items.some(
      (item) => item.category === 'accessory' && item.name.includes('伞')
    );
    if (!hasUmbrella) {
      tips.push({
        id: `tip-rain-${idx}`,
        level: 'info',
        type: 'rain',
        message: '今日有雨，建议携带雨伞',
      });
      idx++;
    }
  }

  const itemColorGroups: { itemId: string; itemName: string; group: string }[] = [];
  for (const item of items) {
    for (const color of item.colors) {
      const group = getColorGroup(color);
      if (group) {
        itemColorGroups.push({ itemId: item.id, itemName: item.name, group });
      }
    }
  }

  const seenClashPairs = new Set<string>();
  for (let i = 0; i < itemColorGroups.length; i++) {
    for (let j = i + 1; j < itemColorGroups.length; j++) {
      const a = itemColorGroups[i];
      const b = itemColorGroups[j];
      if (a.itemId === b.itemId) continue;

      const isClash = CLASH_PAIRS.some(
        ([g1, g2]) =>
          (a.group === g1 && b.group === g2) ||
          (a.group === g2 && b.group === g1)
      );

      const hasNeonClash =
        (a.group === 'neon' && b.group !== 'neon') ||
        (b.group === 'neon' && a.group !== 'neon');

      if (isClash || hasNeonClash) {
        const pairKey = [a.itemId, b.itemId].sort().join('-');
        if (seenClashPairs.has(pairKey)) continue;
        seenClashPairs.add(pairKey);

        tips.push({
          id: `tip-color_clash-${a.itemId}-${b.itemId}`,
          level: 'warning',
          type: 'color_clash',
          message: `「${a.itemName}」与「${b.itemName}」颜色搭配可能冲突，建议调整`,
          itemId: a.itemId,
        });
        idx++;
      }
    }
  }

  for (const item of items) {
    if (item.washStatus === 'washing' || item.washStatus === 'drying') {
      tips.push({
        id: `tip-washing-${item.id}`,
        level: 'error',
        type: 'washing',
        message: `「${item.name}」正在${item.washStatus === 'washing' ? '清洗' : '晾干'}中，无法穿着`,
        itemId: item.id,
      });
      idx++;
    }
  }

  if (occasion === 'interview') {
    for (const item of items) {
      if (item.sizeFit === 'loose') {
        tips.push({
          id: `tip-size_fit-${item.id}`,
          level: 'warning',
          type: 'size_fit',
          message: `面试场合不建议穿着宽松款「${item.name}」，建议选择合身衣物`,
          itemId: item.id,
        });
        idx++;
      }
    }
  }

  if (occasion === 'sport') {
    for (const item of items) {
      if (item.sizeFit === 'fitted') {
        tips.push({
          id: `tip-size_fit-${item.id}`,
          level: 'info',
          type: 'size_fit',
          message: `运动时穿着修身款「${item.name}」可能影响活动，建议选择宽松舒适款式`,
          itemId: item.id,
        });
        idx++;
      }
    }
  }

  for (const item of items) {
    if (item.lastWornDate && isWithinLast3Days(item.lastWornDate)) {
      tips.push({
        id: `tip-repeat_wear-${item.id}`,
        level: 'warning',
        type: 'repeat_wear',
        message: `「${item.name}」最近3天内穿过，建议更换以避免重复穿搭`,
        itemId: item.id,
      });
      idx++;
    }
  }

  return tips;
}
