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
  '2x2': '🥇',
  '2x1': '🥈',
  '1x1': '🥉',
};

const SIZE_LABEL: Record<string, string> = {
  '2x2': '2×2',
  '2x1': '2×1',
  '1x1': '1×1',
};

// 生成渐变色 SVG 作为默认图片
function getDefaultImageSvg(gradient: string, size: string): string {
  const colors: Record<string, [string, string]> = {
    'from-pink-300 to-rose-400': ['#F9A8D4', '#FB7185'],
    'from-purple-300 to-indigo-400': ['#D8B4FE', '#818CF8'],
    'from-blue-300 to-cyan-400': ['#93C5FD', '#22D3EE'],
    'from-green-300 to-emerald-400': ['#86EFAC', '#34D399'],
    'from-yellow-300 to-amber-400': ['#FDE047', '#FBBF24'],
    'from-orange-300 to-red-400': ['#FDBA74', '#F87171'],
    'from-teal-300 to-cyan-500': ['#5EEAD4', '#06B6D4'],
    'from-fuchsia-300 to-pink-500': ['#F0ABFC', '#EC4899'],
  };
  const [c1, c2] = colors[gradient] || ['#F9A8D4', '#FB7185'];
  
  // 花朵图案 SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#g)"/>
    <g transform="translate(100,100)" opacity="0.3">
      <circle cx="0" cy="-30" r="20" fill="white"/>
      <circle cx="28" cy="-10" r="20" fill="white"/>
      <circle cx="18" cy="25" r="20" fill="white"/>
      <circle cx="-18" cy="25" r="20" fill="white"/>
      <circle cx="-28" cy="-10" r="20" fill="white"/>
      <circle cx="0" cy="0" r="15" fill="${c2}"/>
    </g>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

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
      case '2x2': return 'photo-item-2x2';
      case '2x1': return 'photo-item-2x1';
      default: return 'photo-item-1x1';
    }
  };

  const totalSlots = goldCount + silverCount + bronzeCount;
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
            
            // 使用实际照片或默认花朵图片
            const imageUrl = photo.photoUrl || getDefaultImageSvg(gradient, size);
            const isPlaceholder = !photo.photoUrl;

            return (
              <div
                key={photo.id}
                className={`${sizeClass(size)} relative overflow-hidden rounded-lg group ${isPlaceholder ? 'opacity-80' : ''}`}
              >
                <img
                  src={imageUrl}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* 占位符叠加层 */}
                {isPlaceholder && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                    <span className="text-4xl drop-shadow-lg">{MEDAL_EMOJI[size]}</span>
                    <span className="text-white text-xs font-bold mt-2 drop-shadow-md">{SIZE_LABEL[size]}</span>
                    <span className="text-white text-2xl mt-1 drop-shadow-md">+</span>
                  </div>
                )}
                {/* 悬停显示名称 */}
                {photo.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">{photo.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
