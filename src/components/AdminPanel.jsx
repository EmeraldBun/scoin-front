import { useState } from 'react';

const AdminPanel = ({ users, currentUserId, giveCoins, deleteUser, items, deleteItem, addItem }) => {
  const [newUser, setNewUser] = useState({ login: '', password: '', name: '', is_admin: false });
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image_url: '' });
  const [coinAmounts, setCoinAmounts] = useState({});

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoinChange = (userId, value) => {
    setCoinAmounts((prev) => ({ ...prev, [userId]: value }));
  };

  return (
    <div className="space-y-10">
      {/* Users Table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Пользователи</h2>
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="text-zinc-400">
              <th className="p-2">Имя</th>
              <th className="p-2">Баланс</th>
              <th className="p-2">Дать коины</th>
              <th className="p-2">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-zinc-800">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.balance}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={coinAmounts[user.id] || ''}
                    onChange={(e) => handleCoinChange(user.id, e.target.value)}
                    className="bg-zinc-700 px-2 py-1 rounded w-20 text-white text-sm"
                  />
                  <button
                    onClick={() => giveCoins(user.id, Number(coinAmounts[user.id]))}
                    className="ml-2 bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm"
                  >
                    Дать
                  </button>
                </td>
                <td className="p-2">
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Добавить пользователя</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch(`/api/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
              body: JSON.stringify(newUser),
            });
            location.reload();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl"
        >
          <input name="login" placeholder="Логин" onChange={handleUserChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <input name="password" placeholder="Пароль" type="password" onChange={handleUserChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <input name="name" placeholder="Имя" onChange={handleUserChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <label className="flex items-center text-white">
            <input type="checkbox" name="is_admin" onChange={handleUserChange} className="mr-2" /> Админ
          </label>
          <button className="col-span-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded mt-2">
            Добавить
          </button>
        </form>
      </div>

      {/* Item Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Добавить товар</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItem({ ...newItem, price: Number(newItem.price) });
            setNewItem({ name: '', price: '', description: '', image_url: '' });
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl"
        >
          <input name="name" placeholder="Название" value={newItem.name} onChange={handleItemChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <input name="price" placeholder="Цена" type="number" value={newItem.price} onChange={handleItemChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <input name="image_url" placeholder="Картинка (URL)" value={newItem.image_url} onChange={handleItemChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <input name="description" placeholder="Описание" value={newItem.description} onChange={handleItemChange} className="bg-zinc-800 px-3 py-2 rounded text-white" />
          <button className="col-span-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded mt-2">
            Добавить
          </button>
        </form>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Товары</h2>
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="text-zinc-400">
              <th className="p-2">Название</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-zinc-800">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
