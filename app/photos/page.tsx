import { getPhotos, getRewards, PhotoItem } from '@/lib/notion';
import PhotosClient from './PhotosClient';

export default async function PhotosPage() {
  const photos = await getPhotos();
  const rewards = await getRewards();

  // 根据奖牌计算照片位
  const goldCount = rewards.filter(r => r.level === '金牌').length;
  const silverCount = rewards.filter(r => r.level === '银牌').length;
  const bronzeCount = rewards.filter(r => r.level === '铜牌').length;

  // 已上传的照片 - 按顺序分配，不区分尺寸
  const uploadedPhotos = photos.filter(p => p.photoUrl);
  let uploadedIndex = 0;

  // 生成照片位列表 - 尺寸由奖牌类型决定
  const photoSlots: PhotoItem[] = [];
  let order = 1;

  // 金牌照片位 (2x2)
  for (let i = 0; i < goldCount; i++) {
    const uploaded = uploadedPhotos[uploadedIndex++];
    if (uploaded) {
      photoSlots.push({ 
        ...uploaded, 
        size: '2x2', // 强制使用2x2
        order 
      });
    } else {
      photoSlots.push({
        id: `slot-gold-${i}`,
        name: `金牌照片位 ${i + 1}`,
        photoUrl: '',
        size: '2x2',
        orientation: '横向',
        order: order,
      });
    }
    order++;
  }

  // 银牌照片位 (2x1)
  for (let i = 0; i < silverCount; i++) {
    const uploaded = uploadedPhotos[uploadedIndex++];
    if (uploaded) {
      photoSlots.push({ 
        ...uploaded, 
        size: '2x1', // 强制使用2x1
        order 
      });
    } else {
      photoSlots.push({
        id: `slot-silver-${i}`,
        name: `银牌照片位 ${i + 1}`,
        photoUrl: '',
        size: '2x1',
        orientation: '横向',
        order: order,
      });
    }
    order++;
  }

  // 铜牌照片位 (1x1)
  for (let i = 0; i < bronzeCount; i++) {
    const uploaded = uploadedPhotos[uploadedIndex++];
    if (uploaded) {
      photoSlots.push({ 
        ...uploaded, 
        size: '1x1', // 强制使用1x1
        order 
      });
    } else {
      photoSlots.push({
        id: `slot-bronze-${i}`,
        name: `铜牌照片位 ${i + 1}`,
        photoUrl: '',
        size: '1x1',
        orientation: '横向',
        order: order,
      });
    }
    order++;
  }

  return (
    <PhotosClient
      photos={photoSlots}
      goldCount={goldCount}
      silverCount={silverCount}
      bronzeCount={bronzeCount}
    />
  );
}
