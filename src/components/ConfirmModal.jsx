function ConfirmModal({ item, onConfirm, onClose, role }) {
  if (!item) return null

  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Scam-Coin'
      case 'Закрывающий': return 'Scam-Coin'
      default: return 'Scam-Coin'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 fade-in">
      <div className="bg-gray-900 border border-purple-600 p-6 rounded-xl shadow-xl w-full max-w-md glow-card">
        <h2 className="text-xl font-bold text-white mb-4">Подтверждение покупки</h2>
        <p className="text-gray-300 mb-4">
          Вы точно хотите купить{' '}
          <span className="text-white font-semibold">{item.name}</span> за{' '}
          <span className="text-purple-400 font-semibold">
            {item.price} {getCurrencyName(role)}
          </span>?
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-danger">Отмена</button>
          <button onClick={onConfirm} className="btn btn-primary">Купить</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
