import { useState } from 'react'
import { toast } from 'react-toastify'

function Profile({ user, onUpdate }) {
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '' })
  const API_URL = import.meta.env.VITE_API_URL;


  const handleUpload = async () => {
    if (!avatarFile) return
    setLoading(true)
    const formData = new FormData()
    formData.append('avatar', avatarFile)

    try {
      const res = await fetch('${API_URL}/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Аватар обновлён')
        onUpdate({ avatar_url: data.url })
      } else {
        toast.error(data.error || 'Ошибка загрузки')
      }
    } catch (e) {
      toast.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new) return
    try {
      const res = await fetch('${API_URL}/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(passwords),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Пароль изменён')
        setPasswords({ current: '', new: '' })
      } else {
        toast.error(data.error || 'Ошибка смены пароля')
      }
    } catch {
      toast.error('Ошибка смены пароля')
    }
  }

  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  return (
    <div className="fade-in max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-purple-400 text-center">👤 Профиль</h2>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600 text-center">
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-purple-400"
        />
        <p className="mt-2 text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-purple-300 mt-1">Роль: {user.role || 'Не указано'}</p>
        <p className="text-sm text-zinc-400">Валюта: {getCurrencyName(user.role)}</p>
      </div>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600">
        <h3 className="text-lg font-bold text-purple-300 mb-2">📸 Обновить аватар</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="input"
        />
        <button onClick={handleUpload} className="btn btn-primary mt-2" disabled={loading}>
          {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600">
        <h3 className="text-lg font-bold text-purple-300 mb-2">🔑 Сменить пароль</h3>
        <input
          type="password"
          placeholder="Текущий пароль"
          value={passwords.current}
          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          className="input mb-2"
        />
        <input
          type="password"
          placeholder="Новый пароль"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          className="input mb-2"
        />
        <button onClick={handleChangePassword} className="btn btn-secondary">
          Сменить пароль
        </button>
      </div>
    </div>
  )
}

export default Profile
