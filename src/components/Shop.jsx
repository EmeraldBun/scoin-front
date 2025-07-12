import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

/**
 * Магазин товаров.
 *
 * props:
 *  • items  — массив товаров [{ id, name, price, image_url, description }]
 *  • onBuy  — async-функция (itemId) => Promise (приходит из App.jsx)
 *  • role   — роль пользователя (для названия валюты)
 */
function Shop({ items, onBuy, role }) {
  /** товар, который пользователь пытается купить (null = модалка закрыта) */
  const [selectedItem, setSelectedItem] = useState(null);

  /** название валюты зависит от роли */
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос':
        return 'Scam-Coin';
      case 'Закрывающий':
        return 'Scam-Coin';
      default:
        return 'Scam-Coin';
    }
  };

  /** подтверждение покупки в модалке */
  const handleConfirm = async () => {
    if (!selectedItem) return;
    await onBuy(selectedItem.id);   // вызываем колбэк из App.jsx
    setSelectedItem(null);          // закрываем окно
  };

  /** закрыть модалку без покупки */
  const handleClose = () => setSelectedItem(null);

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
        🛍 Магазин
      </h2>

      {/* Сетка карточек товаров */}
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

            <p className="text-green-400 font-bold mb-4">
              {item.price} {getCurrencyName(role)}
            </p>

            {/* Кнопка теперь только открывает ConfirmModal */}
            <button
              onClick={() => setSelectedItem(item)}
              className="btn btn-primary mt-auto"
            >
              Купить
            </button>
          </div>
        ))}
      </div>

      {/* Модальное окно подтверждения */}
      <ConfirmModal
        item={selectedItem}
        role={role}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </div>
  );
}

export default Shop;
