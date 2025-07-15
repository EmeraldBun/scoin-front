import { useState } from 'react';
import { toast } from 'react-toastify';

/**
 * AdminPanel
 *
 * props:
 *  • users, currentUserId, giveCoins, deleteUser, addUser
 *  • items, deleteItem, addItem
 */
function AdminPanel({
  users,
  currentUserId,
  giveCoins,
  deleteUser,
  addUser,
  items,
  deleteItem,
  addItem,
}) {
  /* ────────── local state ────────── */
  const [showUserModal, setShowUserModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    name: '',
    is_admin: false,
  });

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
  });
  const [file, setFile] = useState(null); // выбранный файл

  const [amounts, setAmounts] = useState({}); // { userId: 150 }

  /* ────────── handlers ────────── */
  const resetUserModal = () => setNewUser({ login: '', password: '', name: '', is_admin: false });
  const resetItemModal = () => {
    setNewItem({ name: '', price: '', description: '', image_url: '' });
    setFile(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const ok = await addUser(newUser);
    if (ok) {
      setShowUserModal(false);
      resetUserModal();
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name',        newItem.name);
    fd.append('price',       Number(newItem.price));
    fd.append('description', newItem.description);
    if (file)  fd.append('image', file);
    else       fd.append('image_url', newItem.image_url);

    const ok = await addItem(fd);
    if (ok) {
      setShowItemModal(false);
      resetItemModal();
    }
  };

  /* ========================================================================= */
  return (
    <div className="space-y-10">

      {/* ───────────── USERS ───────────── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Пользователи</h3>
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
          >
            + Добавить
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="py-2 px-3">Имя / логин</th>
              <th className="py-2 px-3">Баланс</th>
              <th className="py-2 px-3">Начислить</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-zinc-400">
                  Нет пользователей
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-700">
                  <td className="py-2 px-3">{u.name || u.login}</td>
                  <td className="py-2 px-3">{u.balance}</td>
                  <td className="py-2 px-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      className="w-24 px-2 py-1 rounded bg-zinc-800 border border-zinc-600"
                      value={amounts[u.id] ?? 100}
                      onChange={(e) =>
                        setAmounts({ ...amounts, [u.id]: Number(e.target.value) })
                      }
                    />
                    <button
                      onClick={() => giveCoins(u.id, amounts[u.id] ?? 100)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                      ➕
                    </button>
                  </td>
                  <td className="py-2 px-3">
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* ───────────── ITEMS ───────────── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Товары</h3>
          <button
            onClick={() => setShowItemModal(true)}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
          >
            + Добавить
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="py-2 px-3">Название</th>
              <th className="py-2 px-3">Цена</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center text-zinc-400">
                  Нет товаров
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="border-b border-zinc-700">
                  <td className="py-2 px-3">{it.name}</td>
                  <td className="py-2 px-3">{it.price}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => deleteItem(it.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* ═════════════ MODAL: Add User ═════════════ */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddUser}
            className="bg-zinc-900 p-6 rounded-xl w-80 space-y-3"
          >
            <h4 className="text-lg font-bold mb-1">Новый пользователь</h4>

            <input
              placeholder="Логин"
              value={newUser.login}
              onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
              required
            />
            <input
              placeholder="Имя (необязательно)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newUser.is_admin}
                onChange={(e) =>
                  setNewUser({ ...newUser, is_admin: e.target.checked })
                }
              />
              Администратор
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowUserModal(false); resetUserModal(); }}
                className="px-4 py-1 bg-zinc-700 rounded"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═════════════ MODAL: Add Item ═════════════ */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddItem}
            className="bg-zinc-900 p-6 rounded-xl w-96 space-y-3"
          >
            <h4 className="text-lg font-bold mb-1">Новый товар</h4>

            <input
              placeholder="Название"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
              required
            />
            <input
              type="number"
              placeholder="Цена"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
              required
            />

            <input
              placeholder="Картинка (URL)"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="text-sm text-zinc-400"
            />

            <textarea
              placeholder="Описание"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full h-24 px-3 py-2 rounded resize-none bg-zinc-800"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowItemModal(false); resetItemModal(); }}
                className="px-4 py-1 bg-zinc-700 rounded"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
