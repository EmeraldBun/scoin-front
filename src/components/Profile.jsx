import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { toast } from 'react-toastify'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const data = await res.json()
        if (res.ok) setUser(data)
      } catch (err) {
        console.error('Ошибка загрузки профиля', err)
      }
    }
    fetchProfile()
  }, [])

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0])
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return toast.error('Выберите файл')

    const formData = new FormData()
    formData.append('avatar', avatarFile)

    try {
      const res = await fetch(`${API_URL}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Аватар обновлён')
        setUser((prev) => ({ ...prev, avatar_url: data.avatar_url }))
      } else {
        toast.error(data.error || 'Ошибка загрузки аватара')
      }
    } catch (err) {
      console.error('Ошибка запроса:', err)
      toast.error('Ошибка загрузки аватара')
    }
  }

  if (!user) return <div className="text-center">Загрузка...</div>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Профиль</h2>
      <div className="mb-4">
        <img
          src={user.avatar_url ? `${API_URL.replace('/api', '')}/uploads/${user.avatar_url}` : '/default-avatar.png'}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <input type="file" onChange={handleAvatarChange} />
        <button
          onClick={handleAvatarUpload}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          Обновить аватар
        </button>
      </div>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Баланс:</strong> {user.balance}</p>
      <p><strong>Роль:</strong> {user.role}</p>
    </div>
  )
}

export default Profile
