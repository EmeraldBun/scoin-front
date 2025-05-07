import React from 'react';
import { useUser } from '../context/UserContext';

const BalanceCard = () => {
  const { user } = useUser();

  if (!user) return null;

  const currencyMap = {
    'Гос': 'Andriana-Coin',
    'Холодник': 'Sknk-Coin',
    'Закрывающий': 'Rezak-Coin',
  };

  const currency = currencyMap[user.role] || 'S-Coin';

  return (
    <div className="flex justify-center mt-4 px-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-neutral-900 border border-purple-500 rounded-2xl p-4 text-center shadow-md">
        <div className="text-white text-lg font-medium break-words">{user.name}</div>
        <div className="text-sm text-gray-400 mb-2">{user.role}</div>
        <div className="text-green-400 text-2xl font-mono font-bold">
          {user.balance} {currency}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
