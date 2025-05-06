function ShopItem({ item, onBuy, role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  return (
    <div className="card glow-card hover:shadow-purple-500/40 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white">{item.name}</h3>
        <span className="text-purple-300 font-medium">
          {item.price} {getCurrencyName(role)}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{item.description}</p>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <button onClick={() => onBuy(item.id)} className="btn btn-primary w-full">
        Купить
      </button>
    </div>
  )
}

export default ShopItem
