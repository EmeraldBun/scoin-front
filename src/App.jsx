import { useEffect, useState } from 'react'
import Header from './components/Header'
import BalanceCard from './components/BalanceCard'
import NavTabs from './components/NavTabs'
import HeroSection from './components/HeroSection'
import Shop from './components/Shop'
import Purchases from './components/Purchases'
import AdminPanel from './components/AdminPanel'
import Profile from './components/Profile'
import Casino from './components/Casino'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ login: '', password: '' })
  const [token, setToken] = useState('')
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [purchases, setPurchases] = useState([])
  const [tab, setTab] = useState('dashboard')
  const isAdmin = localStorage.getItem('is_admin') === 'true'

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('is_admin', data.user.is_admin)
        setToken(data.token)
        setLoggedIn(true)
        toast.success('Вход выполнен')
      } else {
        toast.error('Ошибка авторизации')
      }
    } catch {
      toast.error('Ошибка подключения к серверу')
    }
  }

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setUsers(data)
  }

  const fetchItems = async () => {
    const res = await fetch('http://localhost:3000/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data)
  }

  const fetchPurchases = async () => {
    const res = await fetch('http://localhost:3000/api/my-purchases', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setPurchases(data)
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken('')
    setLoggedIn(false)
  }

  const giveCoins = async (userId) => {
    await fetch(`http://localhost:3000/api/users/${userId}/coins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: 100 }),
    })
    fetchUsers()
    toast.success('Начислено 100 монет')
  }

  const deleteUser = async (userId) => {
    await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchUsers()
    toast.success('Пользователь удалён')
  }

  const deleteItem = async (itemId) => {
    await fetch(`http://localhost:3000/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchItems()
  }

  const buyItem = async (itemId) => {
    const res = await fetch('http://localhost:3000/api/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item_id: itemId }),
    })
    const data = await res.json()
    if (res.ok) {
      fetchPurchases()
      fetchUsers()
      toast.success('Покупка успешна!')
    } else {
      toast.error(data.error || 'Ошибка при покупке')
    }
  }

  const addItem = async (item) => {
    const res = await fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    })
    if (res.ok) {
      fetchItems()
      toast.success('Товар добавлен')
    } else {
      toast.error('Ошибка при добавлении товара')
    }
  }

  const updateUserProfile = (updated) => {
    const updatedUser = { ...user, ...updated }
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)))
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      setLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchUsers()
      fetchItems()
      fetchPurchases()
    }
  }, [loggedIn])

  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null
  const user = users.find((u) => u.id === userId)
  const balance = typeof user?.balance === 'number' ? user.balance : 0
  const role = user?.role || 'Холодник'

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="card w-80 space-y-4">
          <input
            placeholder="Логин"
            value={loginData.login}
            onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
            className="input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="input"
          />
          <button onClick={handleLogin} className="btn btn-success w-full">Войти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto px-4">
        <Header onLogout={handleLogout} role={role} />
        <BalanceCard balance={balance} avatarUrl={user?.avatar_url} role={role} />
        <NavTabs currentTab={tab} setTab={setTab} isAdmin={isAdmin} role={role} />

        {tab === 'dashboard' && <HeroSection role={role} />}
        {tab === 'shop' && <Shop items={items} onBuy={buyItem} role={role} />}
        {tab === 'purchases' && <Purchases purchases={purchases} role={role} />}
        {tab === 'casino' && (
          <Casino
            balance={balance}
            refreshUser={fetchUsers}
            role={role}
          />
        )}
        {tab === 'profile' && user && (
          <Profile user={user} onUpdate={updateUserProfile} />
        )}
        {tab === 'admin' && isAdmin && (
          <AdminPanel
            users={users}
            currentUserId={user?.id}
            giveCoins={giveCoins}
            deleteUser={deleteUser}
            items={items}
            deleteItem={deleteItem}
            addItem={addItem}
          />
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  )
}

export default App
