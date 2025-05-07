import { useState } from 'react'
import CasinoSymbolsEditor from './CasinoSymbolsEditor'

function AdminPanel({ users, currentUserId, giveCoins, deleteUser, items, deleteItem, addItem }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [newUser, setNewUser] = useState({
    login: '',
    name: '',
    password: '',
    is_admin: false,
    role: 'Холодник'
  })

  const handleUserCreate = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newUser),
    })
    if (res.ok) {
      setNewUser({ login: '', name: '', password: '', is_admin: false, role: 'Холодник' })
      alert('Пользователь добавлен')
    } else {
      alert('Ошибка при добавлении')
    }
  }

  return (
    <div className="fade-in space-y-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 text-center">🛠 Админка</h2>

      <div className="overflow-x-auto">
        <h3 className="text-xl font-bold mb-2 text-purple-300">Пользователи</h3>
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-purple-500">
              <th>ID</th>
              <th>Имя</th>
              <th>Баланс</th>
              <th>Роль</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-zinc-700">
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.balance}</td>
                <td>{u.role}</td>
                <td className="flex gap-2">
                  <button onClick={() => giveCoins(u.id)} className="btn btn-secondary btn-sm">
                    +100
                  </button>
                  {u.id !== currentUserId && (
                    <button onClick={() => deleteUser(u.id)} className="btn btn-danger btn-sm">
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-2 text-purple-300">➕ Добавить пользователя</h3>
        <form onSubmit={handleUserCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Логин"
            value={newUser.login}
            onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
            className="input"
          />
          <input
            placeholder="Имя"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="input"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newUser.is_admin}
              onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
            />
            Админ
          </label>

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="input col-span-full"
          >
            <option value="Холодник">Холодник</option>
            <option value="Гос">Гос</option>
            <option value="Закрывающий">Закрывающий</option>
          </select>

          <button type="submit" className="btn btn-primary col-span-full">Добавить</button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-2 text-purple-300">Добавить товар</h3>
        <AddItemForm onAdd={addItem} />
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-xl font-bold mb-2 text-purple-300">Товары</h3>
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="text-purple-500">
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-zinc-700">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => deleteItem(item.id)} className="btn btn-danger btn-sm">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CasinoSymbolsEditor />
    </div>
  )
}

function AddItemForm({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const f = e.target
    const item = {
      name: f.name.value,
      price: parseInt(f.price.value),
      description: f.description.value,
      image_url: f.image_url.value,
    }
    onAdd(item)
    f.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="name" placeholder="Название" className="input w-full" />
      <input name="price" type="number" placeholder="Цена" className="input w-full" />
      <input name="image_url" placeholder="Ссылка на изображение" className="input w-full" />
      <textarea name="description" placeholder="Описание" className="input w-full" />
      <button type="submit" className="btn btn-primary w-full">Добавить</button>
    </form>
  )
}

export default AdminPanel
