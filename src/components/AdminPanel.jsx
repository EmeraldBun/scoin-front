import { useState } from 'react';

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
  /* ───────────── модалки ───────────── */
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    name: '',
    is_admin: false,
  });

  const handleAddUser = async (e) => {
    e.preventDefault();                 // ⬅️ не даём браузеру перезагрузиться
    await addUser(newUser);             // проп из App.jsx
    setShowUserModal(false);            // закрываем окно
    setNewUser({ login: '', password: '', name: '', is_admin: false });
  };

  return (
    <div className="space-y-8">

      {/* ───────────── USERS ───────────── */}
      <section>
        <div className="flex justify-between items-center mb-3">
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
              <th className="py-2 px-3">Имя</th>
              <th className="py-2 px-3">Баланс</th>
              <th className="py-2 px-3">Действия</th>
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
                  <td className="py-2 px-3">
                    <button
                      onClick={() => giveCoins(u.id, 100)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 mr-2 rounded"
                    >
                      +100
                    </button>
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

      {/* ───────────── ITEMS (коротко) ───────────── */}
      {/* … аналогично товары, если нужно … */}

      {/* ───────────── MODAL: add user ───────────── */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
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
                onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
              />
              Администратор
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
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
