function Purchases({ purchases, role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">🧾 Покупки</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {purchases.map((p, i) => (
          <div key={i} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex flex-col max-w-sm mx-auto">
            <img
              src={p.image_url}
              alt={p.name}
              className="h-36 object-contain mb-2 rounded-md"
            />
            <h3 className="text-lg font-bold text-purple-300">{p.name}</h3>
            <p className="text-sm text-gray-400">
              {p.price} {getCurrencyName(role)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(p.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Purchases
