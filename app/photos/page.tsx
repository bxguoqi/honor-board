import { getPhotos, getRewards } from '@/lib/notion';
import PhotosClient from './PhotosClient';

interface PhotoSlot {
  id: string;
  name: string;
  photoUrl: string | null;
  type: 'gold' | 'silver' | 'bronze';
  size: '2x2' | '2x1' | '1x1';
  index: number;
}

export default async function PhotosPage() {
  // 从 Notion 获取数据
  const [photos, rewards] = await Promise.all([
    getPhotos(),
    getRewards(),
  ]);

  // 统计奖牌数量
  const goldCount = rewards.filter(r => r.level === '金牌').length;
  const silverCount = rewards.filter(r => r.level === '银牌').length;
  const bronzeCount = rewards.filter(r => r.level === '铜牌').length;

  // 已上传的照片列表（只取有照片的）
  const uploadedPhotos = photos
    .filter(p => p.photoUrl)
    .map(p => ({
      id: p.id,
      name: p.name,
      photoUrl: p.photoUrl,
    }));

  // 生成照片位列表
  const slots: PhotoSlot[] = [];
  let photoIndex = 0;

  // 金牌位 - 2x2
  for (let i = 0; i < goldCount; i++) {
    const photo = uploadedPhotos[photoIndex++];
    slots.push({
      id: photo?.id || `gold-${i}`,
      name: photo?.name || `金牌照片位 ${i + 1}`,
      photoUrl: photo?.photoUrl || null,
      type: 'gold',
      size: '2x2',
      index: i,
    });
  }

  // 银牌位 - 2x1
  for (let i = 0; i < silverCount; i++) {
    const photo = uploadedPhotos[photoIndex++];
    slots.push({
      id: photo?.id || `silver-${i}`,
      name: photo?.name || `银牌照片位 ${i + 1}`,
      photoUrl: photo?.photoUrl || null,
      type: 'silver',
      size: '2x1',
      index: i,
    });
  }

  // 铜牌位 - 1x1
  for (let i = 0; i < bronzeCount; i++) {
    const photo = uploadedPhotos[photoIndex++];
    slots.push({
      id: photo?.id || `bronze-${i}`,
      name: photo?.name || `铜牌照片位 ${i + 1}`,
      photoUrl: photo?.photoUrl || null,
      type: 'bronze',
      size: '1x1',
      index: i,
    });
  }

  const stats = {
    gold: goldCount,
    silver: silverCount,
    bronze: bronzeCount,
    filled: uploadedPhotos.length,
    total: goldCount + silverCount + bronzeCount,
  };

  return <PhotosClient slots={slots} stats={stats} />;
}
