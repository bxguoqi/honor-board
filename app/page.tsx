import Link from 'next/link';
import { getHonors, getRewards, getAllowance, getPhotos, getProfile } from '@/lib/notion';

export default async function HomePage() {
  const [honors, rewards, allowance, photos, profile] = await Promise.all([
    getHonors(),
    getRewards(),
    getAllowance(),
    getPhotos(),
    getProfile(),
  ]);

  // Get profile info
  const basicInfo = profile.find((p) => p.type === '基本信息');
  const name = basicInfo?.title || '宝贝';
  const intro = basicInfo?.content || '最棒的小女孩';

  // Stats
  const goldCount = rewards.filter((r) => r.level === '金牌').length;
  const silverCount = rewards.filter((r) => r.level === '银牌').length;
  const bronzeCount = rewards.filter((r) => r.level === '铜牌').length;
  const photoCount = photos.filter((p) => p.photoUrl).length;

  // Allowance balance
  const income = allowance
    .filter((a) => a.type === '收入')
    .reduce((sum, a) => sum + a.amount, 0);
  const expense = allowance
    .filter((a) => a.type === '支出')
    .reduce((sum, a) => sum + a.amount, 0);
  const balance = income - expense;

  // Recent rewards (latest 5)
  const recentRewards = rewards.slice(0, 5);

  const levelEmoji: Record<string, string> = {
    '金牌': '🥇',
    '银牌': '🥈',
    '铜牌': '🥉',
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-8 rounded-b-3xl">
        <Link href="/profile" className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
            👧
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{name}</h1>
            <p className="text-white/80 text-sm">{intro}</p>
          </div>
        </Link>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Stats Cards */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-pink-500">{honors.length}</div>
              <div className="text-xs text-gray-500 mt-1">荣誉奖项</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{goldCount}</div>
              <div className="text-xs text-gray-500 mt-1">🥇 金牌</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{silverCount}</div>
              <div className="text-xs text-gray-500 mt-1">🥈 银牌</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{bronzeCount}</div>
              <div className="text-xs text-gray-500 mt-1">🥉 铜牌</div>
            </div>
          </div>
        </div>

        {/* Allowance Balance Card */}
        <Link href="/allowance" className="block">
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white/80 text-sm">零用钱余额</div>
                <div className="text-white text-3xl font-bold mt-1">
                  ¥{balance.toFixed(2)}
                </div>
              </div>
              <div className="text-white/60 text-sm">
                {photoCount} 张照片 📸
              </div>
            </div>
          </div>
        </Link>

        {/* Recent Rewards */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">最近奖励</h2>
            <Link href="/rewards" className="text-pink-500 text-sm">
              查看全部 &gt;
            </Link>
          </div>
          {recentRewards.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">暂无奖励记录</p>
          ) : (
            <div className="space-y-3">
              {recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center gap-3">
                  <span className="text-2xl">{levelEmoji[reward.level] || '🏅'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {reward.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {reward.date || '未设置日期'}
                    </div>
                  </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
