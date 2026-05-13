import { getAllowance } from '@/lib/notion';
import AllowanceClient from './AllowanceClient';

export default async function AllowancePage() {
  const allowance = await getAllowance();
  return <AllowanceClient allowance={allowance} />;
}
