'use client';

interface PhotoSlot {
  id: string;
  name: string;
  photoUrl: string | null;
  type: 'gold' | 'silver' | 'bronze';
  size: '2x2' | '2x1' | '1x1';
  index: number;
}

interface PhotosClientProps {
  slots: PhotoSlot[];
  stats: {
    gold: number;
    silver: number;
    bronze: number;
    filled: number;
    total: number;
  };
}

// 生成花朵占位图 SVG
function getPlaceholderSvg(type: 'gold' | 'silver' | 'bronze', index: number): string {
  const colors = {
    gold: [
      ['#F9A8D4', '#FB7185'],   // pink
      ['#D8B4FE', '#818CF8'],   // purple
      ['#93C5FD', '#22D3EE'],   // blue
    ],
    silver: [
      ['#86EFAC', '#34D399'],   // green
      ['#FDE047', '#FBBF24'],   // yellow
    ],
    bronze: [
      ['#FDBA74', '#F87171'],   // orange
      ['#5EEAD4', '#06B6D4'],   // teal
      ['#F0ABFC', '#EC4899'],   // fuchsia
    ],
  };
  
  const palette = colors[type][index % colors[type].length];
  const [c1, c2] = palette;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#g)"/>
    <g transform="translate(100,100)" opacity="0.25">
      <circle cx="0" cy="-35" r="22" fill="white"/>
      <circle cx="33" cy="-12" r="22" fill="white"/>
      <circle cx="20" cy="28" r="22" fill="white"/>
      <circle cx="-20" cy="28" r="22" fill="white"/>
      <circle cx="-33" cy="-12" r="22" fill="white"/>
      <circle cx="0" cy="0" r="18" fill="${c2}"/>
    </g>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const MEDAL_ICON = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
};

const SIZE_LABEL = {
  '2x2': '2×2',
  '2x1': '2×1',
  '1x1': '1×1',
};

export default function PhotosClient({ slots, stats }: PhotosClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">📸 照片墙</h1>
        <p className="text-white/80 text-sm mt-1">记录美好瞬间</p>
      </div>

      {/* 统计 */}
      <div className="flex justify-around py-4 px-4 bg-white mx-4 -mt-3 rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.gold}×{stats.gold}</div>
          <div className="text-[10px] text-gray-400">大照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.silver}×{stats.silver}</div>
          <div className="text-[10px] text-gray-400">中照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.bronze}×{stats.bronze}</div>
          <div className="text-[10px] text-gray-400">小照片位</div>
        </div>
      </div>

      <div className="px-4 py-2 text-xs text-gray-400 text-center">
        已使用 {stats.filled} / {stats.total} 格
      </div>

      {/* 照片墙网格 */}
      <div className="px-4 pb-24">
        <div 
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoFlow: 'dense',
          }}
        >
          {slots.map((slot) => {
            const isEmpty = !slot.photoUrl;
            const imageUrl = slot.photoUrl || getPlaceholderSvg(slot.type, slot.index);
            
            // 网格跨度
            const colSpan = slot.size === '1x1' ? 1 : 2;
            const rowSpan = slot.size === '2x2' ? 2 : 1;
            
            return (
              <div
                key={slot.id}
                className="relative overflow-hidden rounded-xl bg-white shadow-sm"
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  aspectRatio: slot.size === '2x1' ? '2/1' : slot.size === '2x2' ? '1/1' : '1/1',
                }}
              >
                <img
                  src={imageUrl}
                  alt={slot.name}
                  className="w-full h-full object-cover"
                />
                
                {/* 空位遮罩 */}
                {isEmpty && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
                    <span className="text-4xl drop-shadow-lg">{MEDAL_ICON[slot.type]}</span>
                    <span className="text-white text-xs font-bold mt-1 drop-shadow-md">
                      {SIZE_LABEL[slot.size]}
                    </span>
                    <span className="text-white text-xl mt-0.5 drop-shadow-md">+</span>
                  </div>
                )}
                
                {/* 有照片时的名称标签 */}
                {!isEmpty && slot.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-white text-xs">{slot.name}</span>
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
