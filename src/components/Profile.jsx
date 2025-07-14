import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Profile({ user, onUpdate }) {
  const [name,     setName]     = useState(user.name || '');
  const [curPwd,   setCurPwd]   = useState('');
  const [newPwd,   setNewPwd]   = useState('');
  const [msg,      setMsg]      = useState('');

  const token = localStorage.getItem('token');
  const auth  = { Authorization: `Bearer ${token}` };

  /* ───── смена имени ───── */
  const changeName = async (e) => {
    e.preventDefault();
    if (name === user.name) return;

    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const { user: updated } = await res.json();
      onUpdate(updated);          // обновляем App
      setMsg('Имя обновлено');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  /* ───── смена пароля ───── */
  const changePassword = async (e) => {
    e.preventDefault();
    if (!curPwd || !newPwd) return;

    const res = await fetch(`${API_URL}/users/${user.id}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Пароль изменён');
      setCurPwd('');
      setNewPwd('');
    } else setMsg(data.error || 'Ошибка смены пароля');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div className="space-y-8 max-w-sm mx-auto">

      {/* ───────────── Имя ───────────── */}
      <form onSubmit={changeName} className="space-y-3">
        <h3 className="font-bold text-lg">Смена имени</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full"
        >
          Сохранить
        </button>
      </form>

      {/* ───────────── Пароль ───────────── */}
      <form onSubmit={changePassword} className="space-y-3">
        <h3 className="font-bold text-lg">Смена пароля</h3>
        <input
          type="password"
          placeholder="Текущий пароль"
          value={curPwd}
          onChange={(e) => setCurPwd(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800"
          required
        />
        <input
          type="password"
          placeholder="Новый пароль"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full"
        >
          Изменить пароль
        </button>
      </form>

      {/* ───────────── статус ───────────── */}
      {msg && (
        <p className="text-center text-sm text-green-400">
          {msg}
        </p>
      )}
    </div>
  );
}

export default Profile;
