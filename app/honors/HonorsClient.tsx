'use client';

import HonorCard from '@/components/HonorCard';
import { HonorItem } from '@/lib/notion';

export default function HonorsClient({ honors }: { honors: HonorItem[] }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">🏆 荣誉榜</h1>
        <p className="text-white/80 text-sm mt-1">共 {honors.length} 项荣誉</p>
      </div>

      <div className="px-4 mt-4 space-y-4 pb-4">
        {honors.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-gray-400 mt-3">暂无荣誉记录</p>
          </div>
        ) : (
          honors.map((honor) => <HonorCard key={honor.id} honor={honor} />)
        )}
      </div>
    </div>
  );
}
