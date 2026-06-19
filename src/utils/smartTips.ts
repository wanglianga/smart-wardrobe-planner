import type { ClothingItem, Occasion, SmartTip, WeatherState, WashStatus, AlternativeWithReasons } from '@/types';
import { WASH_STATUS_LABELS } from '@/types';

const HEAVY_MATERIALS = ['wool', 'cashmere', 'leather', '羊毛', '羊绒', '皮革', '羊绒混纺'];
const LIGHT_MATERIALS = ['linen', 'chiffon', 'silk', '亚麻', '雪纺', '真丝'];
const RAIN_SENSITIVE_MATERIALS = ['suede', 'canvas', '麂皮', '帆布'];
const WIND_RESISTANT_MATERIALS = ['leather', 'wool', 'cotton blend', '真皮', '羊毛', '棉混纺', '棉混纺'];
const SUN_PROTECTIVE_MATERIALS = ['linen', 'cotton', '亚麻', '棉', '帆布'];

const HAT_KEYWORDS = ['帽', 'hat', 'cap', 'beanie', 'beret'];

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

function isHat(item: ClothingItem): boolean {
  return item.category === 'accessory' && HAT_KEYWORDS.some((kw) => item.name.toLowerCase().includes(kw));
}

export function generateSmartTips(
  items: ClothingItem[],
  occasion: Occasion | null,
  weather: WeatherState
): SmartTip[] {
  const tips: SmartTip[] = [];
  let idx = 0;

  if (weather.isTempDrop) {
    for (const item of items) {
      if (item.category === 'outerwear') {
        const isLight = LIGHT_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (isLight) {
          tips.push({
            id: `tip-temperature-${item.id}`,
            level: 'warning',
            type: 'temperature',
            message: `降温天气，「${item.name}」面料偏薄，建议更换厚实外套保暖`,
            itemId: item.id,
            removalReason: '降温：面料太薄不够保暖',
          });
          idx++;
        }
      }
    }

    const hasOuterwear = items.some((item) => item.category === 'outerwear');
    if (!hasOuterwear) {
      tips.push({
        id: `tip-temperature-${idx}`,
        level: 'warning',
        type: 'temperature',
        message: '降温天气，未选择外套，建议添加保暖外层',
        removalReason: '降温：缺少外套',
      });
      idx++;
    }

    for (const item of items) {
      if (item.category === 'shoes_bag') {
        const isOpen = item.sizeFit === 'loose' || item.name.includes('凉') || item.name.includes('拖鞋');
        if (isOpen) {
          tips.push({
            id: `tip-temperature-${item.id}-shoes`,
            level: 'warning',
            type: 'temperature',
            message: `降温天气，建议将「${item.name}」更换为保暖鞋款`,
            itemId: item.id,
            removalReason: '降温：鞋款不够保暖',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      if (isHat(item)) {
        const isWarm = HEAVY_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (!isWarm) {
          tips.push({
            id: `tip-temperature-${item.id}-hat`,
            level: 'info',
            type: 'temperature',
            message: `降温天气，「${item.name}」不够保暖，建议换毛线帽或保暖帽款`,
            itemId: item.id,
            removalReason: '降温：帽子不够保暖',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      const isLight = LIGHT_MATERIALS.some((m) =>
        item.material.toLowerCase().includes(m.toLowerCase())
      );
      if (isLight && item.category !== 'outerwear') {
        tips.push({
          id: `tip-temperature-${item.id}-fabric`,
          level: 'info',
          type: 'temperature',
          message: `降温天气，「${item.name}」（${item.material}）面料偏薄，建议选择更厚实的面料`,
          itemId: item.id,
          removalReason: '降温：面料厚度不足',
        });
        idx++;
      }
    }
  }

  if (weather.tempHigh > 28) {
    for (const item of items) {
      const isHeavy = HEAVY_MATERIALS.some((m) =>
        item.material.toLowerCase().includes(m.toLowerCase())
      );
      if (isHeavy) {
        tips.push({
          id: `tip-temperature-hot-${item.id}`,
          level: 'warning',
          type: 'temperature',
          message: `气温较高（最高${weather.tempHigh}°C），「${item.name}」材质偏厚重，建议更换轻薄衣物`,
          itemId: item.id,
          removalReason: `高温${weather.tempHigh}°C：材质过厚`,
        });
        idx++;
      }
    }
  }

  if (weather.tempLow < 10) {
    const hasOuterwear = items.some((item) => item.category === 'outerwear');
    if (!hasOuterwear) {
      tips.push({
        id: `tip-temperature-cold-${idx}`,
        level: 'warning',
        type: 'temperature',
        message: `气温较低（最低${weather.tempLow}°C），未选择外套，建议添加保暖外层`,
        removalReason: `低温${weather.tempLow}°C：缺少外套`,
      });
      idx++;
    }
  }

  if (weather.tempHigh - weather.tempLow > 12) {
    tips.push({
      id: `tip-temperature-diff-${idx}`,
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
            removalReason: '阵雨：材质不耐水',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      if (isHat(item)) {
        const isSensitive = RAIN_SENSITIVE_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (isSensitive) {
          tips.push({
            id: `tip-rain-hat-${item.id}`,
            level: 'warning',
            type: 'rain',
            message: `阵雨天气，「${item.name}」（${item.material}材质）易受损，建议更换防水帽或携带雨伞`,
            itemId: item.id,
            removalReason: '阵雨：帽子材质不耐水',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      if (item.category === 'outerwear') {
        const isSensitive = RAIN_SENSITIVE_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (isSensitive) {
          tips.push({
            id: `tip-rain-outerwear-${item.id}`,
            level: 'warning',
            type: 'rain',
            message: `阵雨天气，「${item.name}」（${item.material}材质）不防雨，建议更换防水外套`,
            itemId: item.id,
            removalReason: '阵雨：外套不防雨',
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

  if (weather.isWindy) {
    for (const item of items) {
      if (item.category === 'outerwear') {
        const isWindResistant = WIND_RESISTANT_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (!isWindResistant && item.sizeFit === 'loose') {
          tips.push({
            id: `tip-wind-outerwear-${item.id}`,
            level: 'warning',
            type: 'wind',
            message: `大风天气，「${item.name}」宽松且不防风，建议更换修身的防风外套`,
            itemId: item.id,
            removalReason: '大风：外套不防风',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      if (isHat(item)) {
        if (item.sizeFit === 'loose' || item.name.includes('草帽') || item.name.includes('宽檐')) {
          tips.push({
            id: `tip-wind-hat-${item.id}`,
            level: 'warning',
            type: 'wind',
            message: `大风天气，「${item.name}」容易被吹走，建议选择贴合头部的帽款`,
            itemId: item.id,
            removalReason: '大风：帽子易被吹走',
          });
          idx++;
        }
      }
    }

    for (const item of items) {
      if (item.category === 'shoes_bag') {
        if (item.sizeFit === 'loose') {
          tips.push({
            id: `tip-wind-shoes-${item.id}`,
            level: 'info',
            type: 'wind',
            message: `大风天气，「${item.name}」鞋型宽松，行走可能不稳，建议选择贴合脚型的鞋款`,
            itemId: item.id,
            removalReason: '大风：鞋型宽松行走不稳',
          });
          idx++;
        }
      }
    }

    const hasHat = items.some((item) => isHat(item));
    if (!hasHat) {
      tips.push({
        id: `tip-wind-${idx}`,
        level: 'info',
        type: 'wind',
        message: '大风天气，建议佩戴帽子保护头部',
      });
      idx++;
    }
  }

  if (weather.isStrongSun) {
    for (const item of items) {
      if (isHat(item)) {
        const isProtective = SUN_PROTECTIVE_MATERIALS.some((m) =>
          item.material.toLowerCase().includes(m.toLowerCase())
        );
        if (!isProtective) {
          tips.push({
            id: `tip-sun-hat-${item.id}`,
            level: 'warning',
            type: 'sun',
            message: `强晒天气，「${item.name}」防晒性不足，建议更换宽檐遮阳帽`,
            itemId: item.id,
            removalReason: '强晒：帽子防晒不足',
          });
          idx++;
        }
      }
    }

    const hasHat = items.some((item) => isHat(item));
    if (!hasHat) {
      tips.push({
        id: `tip-sun-${idx}`,
        level: 'warning',
        type: 'sun',
        message: '强晒天气，未佩戴帽子，建议添加遮阳帽保护头部',
        removalReason: '强晒：缺少遮阳帽',
      });
      idx++;
    }

    for (const item of items) {
      const isHeavy = HEAVY_MATERIALS.some((m) =>
        item.material.toLowerCase().includes(m.toLowerCase())
      );
      if (isHeavy && item.category === 'top') {
        tips.push({
          id: `tip-sun-fabric-${item.id}`,
          level: 'warning',
          type: 'sun',
          message: `强晒天气，「${item.name}」（${item.material}）面料偏厚不透气，建议更换轻薄面料`,
          itemId: item.id,
          removalReason: '强晒：面料过厚不透气',
        });
        idx++;
      }
    }

    for (const item of items) {
      if (item.category === 'shoes_bag' && item.name.includes('靴')) {
        tips.push({
          id: `tip-sun-shoes-${item.id}`,
          level: 'info',
          type: 'sun',
          message: `强晒天气，「${item.name}」过于闷热，建议更换透气鞋款`,
          itemId: item.id,
          removalReason: '强晒：鞋款过于闷热',
        });
        idx++;
      }
    }

    for (const item of items) {
      if (item.category === 'outerwear') {
        tips.push({
          id: `tip-sun-outerwear-${item.id}`,
          level: 'info',
          type: 'sun',
          message: `强晒天气，「${item.name}」外套可能过热，如非必要建议移除`,
          itemId: item.id,
          removalReason: '强晒：外套过热',
        });
        idx++;
      }
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

  const nonCleanStatuses: WashStatus[] = ['washing', 'drying', 'ironing', 'dry_cleaning', 'lent_out'];
  for (const item of items) {
    if (nonCleanStatuses.includes(item.washStatus)) {
      const label = WASH_STATUS_LABELS[item.washStatus];
      tips.push({
        id: `tip-care_status-${item.id}`,
        level: item.washStatus === 'lent_out' ? 'error' : 'warning',
        type: 'care_status',
        message: `「${item.name}」当前状态为「${label}」，不适合穿着`,
        itemId: item.id,
        removalReason: `${label}：暂时无法穿着`,
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

export function findAlternatives(
  item: ClothingItem,
  allClothes: ClothingItem[],
  canvasIds: Set<string>
): AlternativeWithReasons[] {
  const nonCleanStatuses: WashStatus[] = ['washing', 'drying', 'ironing', 'dry_cleaning', 'lent_out'];

  const candidates = allClothes.filter(
    (c) =>
      c.category === item.category &&
      c.id !== item.id &&
      !canvasIds.has(c.id) &&
      !nonCleanStatuses.includes(c.washStatus)
  );

  const scored = candidates.map((c) => {
    let score = 0;
    const matchReasons: string[] = [];

    const sharedColors = c.colors.filter((color) => item.colors.includes(color));
    if (sharedColors.length > 0) {
      score += 3;
      matchReasons.push('颜色相近');
    }

    if (c.sizeFit === item.sizeFit) {
      score += 2;
      matchReasons.push('版型相似');
    }

    const cFormal = isFormal(c);
    const iFormal = isFormal(item);
    if (cFormal === iFormal) {
      score += 2;
      matchReasons.push(iFormal ? '均偏正式' : '均偏休闲');
    }

    return { item: c, score, matchReasons };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score > 0)
    .map((s) => ({ item: s.item, matchReasons: s.matchReasons }))
    .slice(0, 4);
}

function isFormal(item: ClothingItem): boolean {
  const formalMaterials = ['羊毛', '羊绒', '羊毛混纺', '真丝', '醋酸纤维'];
  const formalFits: ClothingItem['sizeFit'][] = ['fitted', 'regular'];
  return formalMaterials.includes(item.material) && formalFits.includes(item.sizeFit);
}
