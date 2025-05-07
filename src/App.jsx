import { useEffect, useState } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import BalanceCard from './components/BalanceCard';
import HeroSection from './components/HeroSection';
import Shop from './components/Shop';
import Purchases from './components/Purchases';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tab, setTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('token');

  const isAdmin = user?.is_admin;
  const role = user?.role;

  useEffect(() => {
    if (!token) return;
    fetchUser();
    fetchItems();
    fetchPurchases();
    if (isAdmin) fetchUsers();
  }, [token]);

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUser(data);
    setBalance(data.balance);
  };

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data);
  };

  const fetchPurchases = async () => {
    const res = await fetch(`${API_URL}/my-purchases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPurchases(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const buyItem = async (itemId) => {
    const res = await fetch(`${API_URL}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item_id: itemId }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Покупка успешна!');
      fetchUser();
      fetchPurchases();
    } else {
      toast.error(data.error || 'Ошибка при покупке');
    }
  };

  const giveCoins = async (userId, amount) => {
    const res = await fetch(`${API_URL}/users/${userId}/coins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    if (res.ok) {
      toast.success('Начисление успешно');
      fetchUsers();
    } else {
      toast.error('Ошибка начисления');
    }
  };

  const deleteUser = async (userId) => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      toast.success('Пользователь удалён');
      fetchUsers();
    } else {
      toast.error('Ошибка удаления');
    }
  };

  const addItem = async (item) => {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      toast.success('Товар добавлен');
      fetchItems();
    } else {
      toast.error('Ошибка при добавлении');
    }
  };

  const deleteItem = async (itemId) => {
    const res = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      toast.success('Товар удалён');
      fetchItems();
    } else {
      toast.error('Ошибка при удалении');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    location.reload();
  };

  if (!token) {
    return <HeroSection onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 font-mono">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <Header onLogout={handleLogout} role={role} />
        <BalanceCard balance={balance} name={user?.name} role={role} />
        <NavTabs currentTab={tab} setTab={setTab} isAdmin={isAdmin} role={role} />

        {tab === 'dashboard' && <HeroSection role={role} />}
        {tab === 'shop' && <Shop items={items} onBuy={buyItem} role={role} />}
        {tab === 'purchases' && <Purchases purchases={purchases} role={role} />}
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
  );
}

export default App;
