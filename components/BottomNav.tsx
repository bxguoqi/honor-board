'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: '首页', href: '/', icon: '🏠' },
  { name: '荣誉榜', href: '/honors', icon: '🏆' },
  { name: '日常奖励', href: '/rewards', icon: '🏅' },
  { name: '零用钱', href: '/allowance', icon: '💰' },
  { name: '照片墙', href: '/photos', icon: '📸' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on profile page
  if (pathname === '/profile') return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-pink-100 z-50">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-pink-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] mt-0.5">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
