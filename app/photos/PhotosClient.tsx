import { PhotoItem } from '@/lib/notion';

export default function PhotosClient({ photos }: { photos: PhotoItem[] }) {
  // Generate placeholder items to fill the grid (up to 12 items)
  const totalSlots = Math.max(photos.length, 12);
  const gridItems: (PhotoItem | null)[] = [...photos];
  while (gridItems.length < totalSlots) {
    gridItems.push(null);
  }

  const sizeClass = (size: string) => {
    switch (size) {
      case '2x3': return 'photo-item-2x3';
      case '1x2': return 'photo-item-1x2';
      default: return 'photo-item-1x1';
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">📸 照片墙</h1>
        <p className="text-white/80 text-sm mt-1">记录美好瞬间</p>
      </div>

      <div className="px-4 mt-4 pb-4">
        <div className="photo-grid">
          {gridItems.map((photo, index) => {
            if (photo && photo.photoUrl) {
              return (
                <div
                  key={photo.id}
                  className={`${sizeClass(photo.size || '1x1')} relative overflow-hidden rounded-lg group`}
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

            // Placeholder
            const placeholderSize = photo?.size || '1x1';
            return (
              <div
                key={`placeholder-${index}`}
                className={`${sizeClass(placeholderSize)} border-2 border-dashed border-pink-200 rounded-lg flex items-center justify-center bg-pink-50/50 min-h-[80px]`}
              >
                <span className="text-pink-300 text-2xl">+</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
