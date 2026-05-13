import { AllowanceItem } from '@/lib/notion';

export default function AllowanceClient({ allowance }: { allowance: AllowanceItem[] }) {
  const income = allowance
    .filter((a) => a.type === '收入')
    .reduce((sum, a) => sum + a.amount, 0);
  const expense = allowance
    .filter((a) => a.type === '支出')
    .reduce((sum, a) => sum + a.amount, 0);
  const balance = income - expense;

  // Current month stats
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthItems = allowance.filter((a) => a.date && a.date.startsWith(currentMonth));
  const monthIncome = monthItems
    .filter((a) => a.type === '收入')
    .reduce((sum, a) => sum + a.amount, 0);
  const monthExpense = monthItems
    .filter((a) => a.type === '支出')
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div>
      <div className="bg-gradient-to-br from-purple-400 to-purple-500 px-5 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">💰 零用钱</h1>
        <div className="mt-4 text-center">
          <div className="text-white/80 text-sm">当前余额</div>
          <div className="text-white text-4xl font-bold mt-1">¥{balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 text-sm mb-3">
            本月汇总 ({currentMonth})
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-green-600 text-xs">收入</div>
              <div className="text-green-600 text-xl font-bold mt-1">+{monthIncome.toFixed(2)}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-red-500 text-xs">支出</div>
              <div className="text-red-500 text-xl font-bold mt-1">-{monthExpense.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 text-sm mb-3">收支明细</h2>
          {allowance.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">暂无记录</p>
          ) : (
            <div className="space-y-3">
              {allowance.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      item.type === '收入' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {item.type === '收入' ? '📈' : '📉'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.date || '未设置日期'}
                      {item.note && ` · ${item.note}`}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      item.type === '收入' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {item.type === '收入' ? '+' : '-'}{item.amount.toFixed(2)}
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
