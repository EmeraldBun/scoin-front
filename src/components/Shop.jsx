import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

/**
 * Магазин товаров.
 *
 * props:
 *   • items  — [{ id, name, price, image_url, description }]
 *   • onBuy  — (itemId) => Promise
 *   • role   — роль пользователя (чтобы подписать валюту)
 */
function Shop({ items, onBuy, role }) {
  /* товар, выбранный для покупки; null => модалка закрыта */
  const [selectedItem, setSelectedItem] = useState(null);

  const currency = role ? 'Scam-Coin' : 'Scam-Coin'; // можно расширить

  /* подтвердить покупку */
  const handleConfirm = async () => {
    if (!selectedItem) return;
    await onBuy(selectedItem.id);
    setSelectedItem(null);
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
        🛍 Магазин
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 shadow-md flex flex-col max-w-sm mx-auto"
          >
            <img
              src={it.image_url}
              alt={it.name}
              className="rounded-md mb-2 h-40 object-contain"
            />
            <h3 className="text-lg font-bold text-purple-300">{it.name}</h3>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {it.description}
            </p>

            <p className="text-green-400 font-bold mb-4">
              {it.price} {currency}
            </p>

            <button
              onClick={() => setSelectedItem(it)}
              className="btn btn-primary mt-auto"
            >
              Купить
            </button>
          </div>
        ))}
      </div>

      {/* модальное окно */}
      <ConfirmModal
        open={!!selectedItem}
        item={selectedItem}
        onConfirm={handleConfirm}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

export default Shop;
