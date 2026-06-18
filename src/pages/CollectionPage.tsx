import { Bookmark } from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import SavedOutfitCard from '@/components/SavedOutfitCard';
import OutfitHistory from '@/components/OutfitHistory';

export default function CollectionPage() {
  const savedOutfits = useWardrobeStore((s) => s.savedOutfits);

  return (
    <div className="min-h-screen bg-ivory font-body">
      <header className="flex items-center gap-2.5 px-5 py-4 bg-ivory border-b border-sand/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta/10">
          <Bookmark className="h-4 w-4 text-terracotta" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-charcoal leading-tight">穿搭收藏</h1>
          <p className="text-[10px] text-warm-gray">保存的穿搭方案</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 px-4 pb-6">
        <div>
          {savedOutfits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-warm-gray">
              <Bookmark className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">暂无收藏的穿搭</p>
              <p className="text-[11px] mt-1">在搭配规划页面保存你的穿搭组合</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {savedOutfits.map((outfit) => (
                <SavedOutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="zone-section">
            <OutfitHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
