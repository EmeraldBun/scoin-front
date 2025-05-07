import React, { useState } from 'react';

const Profile = ({ user, onUpdate }) => {
  const [newName, setNewName] = useState(user.name);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handleNameChange = async () => {
    const res = await fetch(`/api/profile/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      onUpdate({ name: newName });
    }
  };

  const handlePasswordChange = async () => {
    const res = await fetch(`/api/profile/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(passwords),
    });
    if (res.ok) {
      setPasswords({ current: '', new: '' });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Ваш профиль</h2>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-700">
          <div className="mb-3">
            <label className="block text-sm text-zinc-400 mb-1">Имя</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white text-sm"
            />
          </div>
          <button
            onClick={handleNameChange}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded text-sm"
          >
            Сохранить имя
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Сменить пароль</h2>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-700 space-y-3">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Текущий пароль</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Новый пароль</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white text-sm"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded text-sm"
          >
            Сменить пароль
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
