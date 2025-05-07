import React from 'react';

const ShopItem = ({ item, onBuy }) => {
  return (
    <div className="bg-zinc-900 rounded-xl p-3 sm:p-4 border border-zinc-700 shadow hover:shadow-lg transition duration-200 w-full max-w-xs mx-auto">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-28 sm:h-32 object-cover rounded mb-2"
      />
      <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.name}</h3>
      <p className="text-sm sm:text-base text-zinc-300 mb-3 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-purple-300 text-sm sm:text-base font-medium">
          {item.price} S-Coin
        </span>
        <button
          onClick={() => onBuy(item.id)}
          className="bg-purple-700 hover:bg-purple-800 text-white text-sm sm:text-base px-3 py-1 rounded-lg"
        >
          Купить
        </button>
      </div>
    </div>
  );
};

export default ShopItem;
