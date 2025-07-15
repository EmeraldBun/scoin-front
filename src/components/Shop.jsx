import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

/**
 * Shop
 *
 * props:
 *   items — [{ id, name, price, image_url, description }]
 *   onBuy — (itemId) => Promise
 */
function Shop({ items, onBuy }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleConfirm = async (id) => {
    try {
      await onBuy(id);
      toast.success('Покупка успешна!');
    } catch {
      toast.error('Ошибка покупки');
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto px-2">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">🛍 Магазин</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 shadow-md flex flex-col max-w-sm mx-auto"
          >
            <img
              src={it.image_url || '/placeholder.png'}
              alt={it.name}
              className="h-40 object-contain mb-2 rounded"
            />
            <h3 className="text-lg font-bold text-purple-300 mb-1">
              {it.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
              {it.description}
            </p>
            <p className="text-green-400 font-bold mb-4">
              {it.price} ScamCoin
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

      {/* модальное окно подтверждения */}
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
