import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function Shop({ items, onBuy, role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">🛍 Магазин</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 shadow-md flex flex-col max-w-sm mx-auto"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="rounded-md mb-2 h-40 object-contain"
            />
            <h3 className="text-lg font-bold text-purple-300">{item.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{item.description}</p>
            <p className="text-green-400 font-bold mb-2">
              {item.price} {getCurrencyName(role)}
            </p>
            <button
              onClick={() => onBuy(item.id)}
              className="btn btn-primary mt-auto"
            >
              Купить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shop
