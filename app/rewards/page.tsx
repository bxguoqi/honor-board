import { getRewards } from '@/lib/notion';
import RewardsClient from './RewardsClient';

export default async function RewardsPage() {
  const rewards = await getRewards();
  return <RewardsClient rewards={rewards} />;
}
