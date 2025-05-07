import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { toast } from 'react-toastify'

const Profile = ({ onUpdate }) => {
  const [user, setUser] = useState(null)
  const [newName, setNewName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const data = await res.json()
        if (res.ok) {
          setUser(data)
        } else {
          toast.error('Ошибка загрузки профиля')
        }
      } catch (e) {
        toast.error('Ошибка загрузки профиля')
      }
    }
    fetchProfile()
  }, [])

  const handleNameChange = async () => {
    if (!newName.trim()) return toast.error('Введите новое имя')
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName, avatar_url: null }),
      })
      if (res.ok) {
        toast.success('Имя обновлено')
        setUser({ ...user, name: newName })
        setNewName('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Ошибка обновления')
      }
    } catch (e) {
      toast.error('Ошибка запроса')
    }
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return toast.error('Заполните оба поля')
    try {
      const res = await fetch(`${API_URL}/users/${user.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        toast.success('Пароль обновлён')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Ошибка смены пароля')
      }
    } catch (e) {
      toast.error('Ошибка запроса')
    }
  }

  if (!user) return <div className="text-center text-white">Загрузка профиля...</div>

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-700 text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">👤 Профиль</h2>
      <div className="space-y-2 mb-6">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Баланс:</strong> {user.balance}</p>
        <p><strong>Роль:</strong> {user.role}</p>
      </div>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600 mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-2">✏️ Сменить имя</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Новое имя"
          className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-500"
        />
        <button onClick={handleNameChange} className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">
          Сменить имя
        </button>
      </div>

      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-600">
        <h3 className="text-lg font-bold text-purple-300 mb-2">🔒 Сменить пароль</h3>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Текущий пароль"
          className="w-full px-3 py-2 mb-2 rounded bg-zinc-700 text-white border border-zinc-500"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Новый пароль"
          className="w-full px-3 py-2 mb-2 rounded bg-zinc-700 text-white border border-zinc-500"
        />
        <button onClick={handlePasswordChange} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">
          Сменить пароль
        </button>
      </div>
    </div>
  )
}

export default Profile
