function BalanceCard({ balance, avatarUrl, role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос':
        return 'Andriana-Coin'
      case 'Закрывающий':
        return 'Rezak-Coin'
      default:
        return 'Sknk-Coin'
    }
  }

  return (
    <div className="bg-zinc-800 rounded-xl p-4 mb-6 border border-purple-500 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt="аватар"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500"
        />
        <div className="text-center sm:text-left">
          <p className="text-zinc-400 text-sm">Ваш баланс</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            {typeof balance === 'number' ? `${balance} ${getCurrencyName(role)}` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard
