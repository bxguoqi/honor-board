import { getPhotos, getRewards, PhotoItem } from '@/lib/notion';
import PhotosClient from './PhotosClient';

export default async function PhotosPage() {
  const photos = await getPhotos();
  const rewards = await getRewards();

  // 根据奖牌计算照片位
  const goldCount = rewards.filter(r => r.level === '金牌').length;
  const silverCount = rewards.filter(r => r.level === '银牌').length;
  const bronzeCount = rewards.filter(r => r.level === '铜牌').length;

  // 已上传的照片按尺寸分类
  const uploadedBySize: Record<string, PhotoItem[]> = {
    '2x3': [],
    '1x2': [],
    '1x1': [],
  };
  for (const photo of photos) {
    const size = photo.size || '1x1';
    if (uploadedBySize[size]) {
      uploadedBySize[size].push(photo);
    }
  }

  // 生成照片位列表
  const photoSlots: PhotoItem[] = [];
  let order = 1;

  // 金牌照片位 (2x3) - 固定3个大格子
  for (let i = 0; i < goldCount; i++) {
    const uploaded = uploadedBySize['2x3'][i];
    if (uploaded) {
      photoSlots.push({ ...uploaded, order });
    } else {
      photoSlots.push({
        id: `slot-gold-${i}`,
        name: `金牌照片位 ${i + 1}`,
        photoUrl: '',
        size: '2x3',
        orientation: '横向',
        order: order,
      });
    }
    order++;
  }

  // 银牌照片位 (1x2) - 固定2个中格子
  for (let i = 0; i < silverCount; i++) {
    const uploaded = uploadedBySize['1x2'][i];
    if (uploaded) {
      photoSlots.push({ ...uploaded, order });
    } else {
      photoSlots.push({
        id: `slot-silver-${i}`,
        name: `银牌照片位 ${i + 1}`,
        photoUrl: '',
        size: '1x2',
        orientation: '横向',
        order: order,
      });
    }
    order++;
  }

  // 铜牌照片位 (1x1) - 固定3个小格子
  for (let i = 0; i < bronzeCount; i++) {
    const uploaded = uploadedBySize['1x1'][i];
    if (uploaded) {
      photoSlots.push({ ...uploaded, order });
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
