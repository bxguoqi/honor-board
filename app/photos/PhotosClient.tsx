import { PhotoItem } from '@/lib/notion';

const GRADIENTS = [
  'from-pink-300 to-rose-400',
  'from-purple-300 to-indigo-400',
  'from-blue-300 to-cyan-400',
  'from-green-300 to-emerald-400',
  'from-yellow-300 to-amber-400',
  'from-orange-300 to-red-400',
  'from-teal-300 to-cyan-500',
  'from-fuchsia-300 to-pink-500',
];

const MEDAL_EMOJI: Record<string, string> = {
  '2x3': '🥇',
  '1x2': '🥈',
  '1x1': '🥉',
};

const SIZE_LABEL: Record<string, string> = {
  '2x3': '2×3',
  '1x2': '1×2',
  '1x1': '1×1',
};

export default function PhotosClient({
  photos,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
}: {
  photos: PhotoItem[];
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
}) {
  const sizeClass = (size: string) => {
    switch (size) {
      case '2x3': return 'photo-item-2x3';
      case '1x2': return 'photo-item-1x2';
      default: return 'photo-item-1x1';
    }
  };

  const totalSlots = goldCount * 6 + silverCount * 2 + bronzeCount * 1;
  const filledCount = photos.filter(p => p.photoUrl).length;

  return (
    <div>
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">📸 照片墙</h1>
        <p className="text-white/80 text-sm mt-1">记录美好瞬间</p>
      </div>

      {/* 统计信息 */}
      <div className="flex justify-around py-3 px-4">
        <div className="text-center">
          <div className="text-lg">🥇×{goldCount}</div>
          <div className="text-[10px] text-gray-400">大照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">🥈×{silverCount}</div>
          <div className="text-[10px] text-gray-400">中照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">🥉×{bronzeCount}</div>
          <div className="text-[10px] text-gray-400">小照片位</div>
        </div>
      </div>

      <div className="px-3 text-xs text-gray-400 text-center pb-2">
        已使用 {filledCount} / {totalSlots} 格
      </div>

      <div className="px-4 pb-4">
        <div className="photo-grid">
          {photos.map((photo, index) => {
            const size = photo.size || '1x1';
            const gradient = GRADIENTS[index % GRADIENTS.length];

            if (photo.photoUrl) {
              return (
                <div
                  key={photo.id}
                  className={`${sizeClass(size)} relative overflow-hidden rounded-lg group`}
                >
                  <img
                    src={photo.photoUrl}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {photo.name && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px]">{photo.name}</span>
                    </div>
                  )}
                </div>
              );
            }

            // 占位符 - 根据奖牌大小显示
            return (
              <div
                key={photo.id || `placeholder-${index}`}
                className={`${sizeClass(size)} border-2 border-dashed border-pink-200 rounded-lg flex flex-col items-center justify-center bg-gradient-to-br ${gradient} bg-opacity-20 min-h-[80px]`}
              >
                <span className="text-3xl opacity-30">{MEDAL_EMOJI[size]}</span>
                <span className="text-[9px] text-pink-300 mt-1">{SIZE_LABEL[size]}</span>
                <span className="text-pink-400 text-lg mt-0.5">+</span>
                {photo.name && (
                  <span className="text-[8px] text-pink-300 mt-0.5 px-1 truncate max-w-full">{photo.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
