function BalanceCard({ balance, role, name }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос':
        return 'Andriana-Coin';
      case 'Закрывающий':
        return 'Rezak-Coin';
      default:
        return 'Sknk-Coin';
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 mb-6 border border-purple-600 shadow-lg max-w-md mx-auto">
      <div className="text-center space-y-1">
        <p className="text-xl font-semibold text-white">{name}</p>
        <p className="text-3xl font-bold text-green-400">
          {typeof balance === 'number' ? `${balance} ${getCurrencyName(role)}` : '—'}
        </p>
      </div>
    </div>
  );
}

export default BalanceCard;
