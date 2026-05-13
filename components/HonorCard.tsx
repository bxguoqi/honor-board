'use client';

import { useState } from 'react';
import { HonorItem } from '@/lib/notion';

const levelColors: Record<string, string> = {
  '国家级': 'bg-red-100 text-red-600',
  '省级': 'bg-orange-100 text-orange-600',
  '市级': 'bg-blue-100 text-blue-600',
  '区级': 'bg-green-100 text-green-600',
  '校级': 'bg-purple-100 text-purple-600',
};

const categoryEmoji: Record<string, string> = {
  '学习': '📚',
  '体育': '⚽',
  '艺术': '🎨',
  '品德': '💝',
  '其他': '⭐',
};

export default function HonorCard({ honor }: { honor: HonorItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${flipped ? 'flipped' : ''}`}
      style={{ height: '280px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front bg-white shadow-sm border border-pink-50">
          {honor.imageUrl ? (
            <img
              src={honor.imageUrl}
              alt={honor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-4">
              <span className="text-4xl mb-2">{categoryEmoji[honor.category] || '🏆'}</span>
              <span className="text-sm font-bold text-pink-600 text-center">{honor.name}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <span className="text-white text-sm font-medium">{honor.name}</span>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-white shadow-sm border border-pink-50 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-3">{honor.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🏛️</span>
                <span className="text-gray-600">{honor.organization || '未填写'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📅</span>
                <span className="text-gray-600">{honor.date || '未填写'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📊</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[honor.level] || 'bg-gray-100 text-gray-600'}`}>
                  {honor.level || '未分类'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🏷️</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
                  {categoryEmoji[honor.category]} {honor.category || '未分类'}
                </span>
              </div>
            </div>
          </div>
          {honor.description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{honor.description}</p>
          )}
          <p className="text-xs text-pink-400 text-center mt-2">点击翻回正面</p>
        </div>
      </div>
    </div>
  );
}
