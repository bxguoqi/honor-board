import { getHonors } from '@/lib/notion';
import HonorsClient from './HonorsClient';

export default async function HonorsPage() {
  const honors = await getHonors();
  return <HonorsClient honors={honors} />;
}
