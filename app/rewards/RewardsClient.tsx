'use client';

import { useState } from 'react';
import { RewardItem } from '@/lib/notion';

const levelEmoji: Record<string, string> = {
  '金牌': '🥇',
  '银牌': '🥈',
  '铜牌': '🥉',
};

const categoryEmoji: Record<string, string> = {
  '学习': '📚',
  '品德': '💝',
  '家务': '🏠',
  '运动': '🏃',
  '艺术': '🎨',
};

const filters = ['全部', '金牌', '银牌', '铜牌', '未使用', '已使用'];

export default function RewardsClient({ rewards }: { rewards: RewardItem[] }) {
  const [activeFilter, setActiveFilter] = useState('全部');

  const goldCount = rewards.filter((r) => r.level === '金牌').length;
  const silverCount = rewards.filter((r) => r.level === '银牌').length;
  const bronzeCount = rewards.filter((r) => r.level === '铜牌').length;

  const filteredRewards = rewards.filter((r) => {
    if (activeFilter === '全部') return true;
    if (activeFilter === '未使用' || activeFilter === '已使用') return r.status === activeFilter;
    return r.level === activeFilter;
  });

  return (
    <div>
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">🏅 日常奖励</h1>
        <div className="flex justify-around mt-4">
          <div className="text-center">
            <div className="text-3xl">🥇</div>
            <div className="text-white font-bold text-lg">{goldCount}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl">🥈</div>
            <div className="text-white font-bold text-lg">{silverCount}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl">🥉</div>
            <div className="text-white font-bold text-lg">{bronzeCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 border border-pink-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Reward List */}
      <div className="px-4 mt-3 space-y-3 pb-4">
        {filteredRewards.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-4xl">🏅</span>
            <p className="text-gray-400 mt-3">暂无奖励记录</p>
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{levelEmoji[reward.level] || '🏅'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-sm">{reward.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        reward.status === '未使用'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {reward.status || '未使用'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{reward.date || '未设置日期'}</div>
                  {reward.categories.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {reward.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-500"
                        >
                          {categoryEmoji[cat] || ''} {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {reward.status === '已使用' && reward.useReason && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-400">使用原因：</span>
                      {reward.useReason}
                      {reward.useDate && (
                        <span className="text-gray-400 ml-1">({reward.useDate})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
