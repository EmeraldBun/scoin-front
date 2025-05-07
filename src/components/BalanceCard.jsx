import React from 'react';

const currencyMap = {
  'Гос': 'Andriana-Coin',
  'Холодник': 'Sknk-Coin',
  'Закрывающий': 'Rezak-Coin',
};

const BalanceCard = ({ name, balance, role }) => {
  const currency = currencyMap[role] || 'S-Coin';

  return (
    <div className="flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-purple-500 rounded-2xl p-4 sm:p-6 text-center shadow-lg">
        <div className="text-white text-lg sm:text-xl font-semibold break-words">{name}</div>
        <div className="text-sm text-zinc-400 mb-2">{role}</div>
        <div className="text-green-400 text-2xl sm:text-3xl font-mono font-bold">
          {balance} {currency}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
