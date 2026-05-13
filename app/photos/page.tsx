import { getPhotos, getRewards, PhotoItem } from '@/lib/notion';
import PhotosClient from './PhotosClient';

export default async function PhotosPage() {
  const photos = await getPhotos();
  const rewards = await getRewards();

  // 根据奖牌计算照片位
  const goldCount = rewards.filter(r => r.level === '金牌').length;
  const silverCount = rewards.filter(r => r.level === '银牌').length;
  const bronzeCount = rewards.filter(r => r.level === '铜牌').length;

  // 生成照片位列表（已上传 + 待添加）
  const photoSlots: PhotoItem[] = [];

  // 已上传的照片
  for (const photo of photos) {
    photoSlots.push(photo);
  }

  // 根据奖牌生成待添加的照片位
  const usedOrders = new Set(photos.map(p => p.order));
  let order = 1;

  // 金牌照片位 (2x3)
  let goldSlotsCreated = 0;
  for (const reward of rewards.filter(r => r.level === '金牌')) {
    if (goldSlotsCreated >= goldCount) break;
    if (!usedOrders.has(order)) {
      photoSlots.push({
        id: `slot-gold-${goldSlotsCreated}`,
        name: `${reward.name} 的照片位`,
        photoUrl: '',
        size: '2x3',
        orientation: '横向',
        order: order,
      });
    }
    goldSlotsCreated++;
    order++;
  }

  // 银牌照片位 (1x2)
  let silverSlotsCreated = 0;
  for (const reward of rewards.filter(r => r.level === '银牌')) {
    if (silverSlotsCreated >= silverCount) break;
    if (!usedOrders.has(order)) {
      photoSlots.push({
        id: `slot-silver-${silverSlotsCreated}`,
        name: `${reward.name} 的照片位`,
        photoUrl: '',
        size: '1x2',
        orientation: '横向',
        order: order,
      });
    }
    silverSlotsCreated++;
    order++;
  }

  // 铜牌照片位 (1x1)
  let bronzeSlotsCreated = 0;
  for (const reward of rewards.filter(r => r.level === '铜牌')) {
    if (bronzeSlotsCreated >= bronzeCount) break;
    if (!usedOrders.has(order)) {
      photoSlots.push({
        id: `slot-bronze-${bronzeSlotsCreated}`,
        name: `${reward.name} 的照片位`,
        photoUrl: '',
        size: '1x1',
        orientation: '横向',
        order: order,
      });
    }
    bronzeSlotsCreated++;
    order++;
  }

  // 按排序
  photoSlots.sort((a, b) => a.order - b.order);

  return (
    <PhotosClient
      photos={photoSlots}
      goldCount={goldCount}
      silverCount={silverCount}
      bronzeCount={bronzeCount}
    />
  );
}
