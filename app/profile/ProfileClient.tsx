import Link from 'next/link';
import { ProfileItem } from '@/lib/notion';

export default function ProfileClient({ profile }: { profile: ProfileItem[] }) {
  const basicInfo = profile.find((p) => p.type === '基本信息');
  const hobbies = profile.filter((p) => p.type === '爱好');
  const specialties = profile.filter((p) => p.type === '特长');
  const timeline = profile.filter((p) => p.type === '时间线');

  const name = basicInfo?.title || '宝贝';
  const intro = basicInfo?.content || '';

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
            👧
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">{name}</h1>
            {intro && <p className="text-white/80 text-sm mt-1">{intro}</p>}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4 pb-8">
        {/* Basic Info Grid */}
        {basicInfo && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span>📋</span> 基本信息
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {profile
                .filter((p) => p.type === '基本信息' && p.icon)
                .map((item) => (
                  <div key={item.id} className="bg-pink-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{item.icon}</span> {item.title}
                    </div>
                    <div className="text-sm font-medium text-gray-800 mt-1">{item.content}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span>💖</span> 兴趣爱好
            </h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-sm text-pink-600 border border-pink-100"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span>⭐</span> 特长成就
            </h2>
            <div className="space-y-2">
              {specialties.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">{item.icon || '🌟'}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item.title}</div>
                    {item.content && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.content}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span>📅</span> 成长时间线
            </h2>
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-pink-200" />
              {timeline.map((item) => (
                <div key={item.id} className="relative pb-4 last:pb-0">
                  {/* Dot */}
                  <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-pink-400 border-2 border-white" />
                  <div className="text-xs text-pink-500 font-medium">{item.title}</div>
                  {item.content && (
                    <div className="text-sm text-gray-700 mt-1">{item.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link
          href="/"
          className="block text-center text-pink-500 text-sm py-3 bg-white rounded-2xl shadow-sm"
        >
          &lt; 返回首页
        </Link>
      </div>
    </div>
  );
}
