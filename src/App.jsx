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

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  /* ──────────────────── глобальный token ──────────────────── */
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  /* ──────────────────── остальные стейты ──────────────────── */
  const [user,       setUser]       = useState(null);
  const [balance,    setBalance]    = useState(0);
  const [tab,        setTab]        = useState('dashboard');
  const [items,      setItems]      = useState([]);
  const [purchases,  setPurchases]  = useState([]);
  const [users,      setUsers]      = useState([]);

  const isAdmin = user?.is_admin;

  /* ══════════════════════ login callback ═════════════════════ */
  const handleLogin = ({ token: tkn, user: usr }) => {
    localStorage.setItem('token', tkn);
    setToken(tkn);
    setUser(usr);
    setBalance(usr.balance);
  };

  /* ═════════════ подгружаем данные, когда появился token ═════ */
  useEffect(() => {
    if (!token) return;
    fetchUser();
    fetchItems();
    fetchPurchases();
  }, [token]);

  /* ─── если пользователь оказался админом — тянем список ─── */
  useEffect(() => {
    if (user?.is_admin) fetchUsers();
  }, [user?.is_admin]);

  /* ═══════════════ helpers для запросов ═══════════════ */
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/me`, { headers: authHeader() });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setBalance(data.balance);
    }
  };

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items`, { headers: authHeader() });
    if (res.ok) setItems(await res.json());
  };

  const fetchPurchases = async () => {
    const res = await fetch(`${API_URL}/my-purchases`, { headers: authHeader() });
    if (res.ok) setPurchases(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`, { headers: authHeader() });
    if (res.ok) setUsers(await res.json());
  };

  /* ═══════════════ actions ═══════════════ */
  const buyItem = async (itemId) => {
    const res = await fetch(`${API_URL}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ item_id: itemId }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Покупка успешна!');
      fetchUser();
      fetchPurchases();
      setTab('purchases');
    } else toast.error(data.error || 'Ошибка покупки');
  };

  const giveCoins = async (id, amount) => {
    const res = await fetch(`${API_URL}/users/${id}/coins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ amount }),
    });
    res.ok ? (toast.success('Начислено'), fetchUsers())
           : toast.error('Ошибка начисления');
  };

  const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    res.ok ? (toast.success('Удалён'), fetchUsers())
           : toast.error('Ошибка удаления');
  };

  const addItem = async (item) => {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(item),
    });
    res.ok ? (toast.success('Товар добавлен'), fetchItems())
           : toast.error('Ошибка добавления');
  };

  const deleteItem = async (id) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    res.ok ? (toast.success('Товар удалён'), fetchItems())
           : toast.error('Ошибка удаления');
  };

  const updateUserProfile = (u) => setUser((prev) => ({ ...prev, ...u }));

  const handleLogout = () => {
    localStorage.removeItem('token');
    location.reload();
  };

  /* ═══════════════ render ═══════════════ */
  if (!token || !user) {
    return <HeroSection onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 font-mono">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <Header onLogout={handleLogout} />

        <BalanceCard balance={balance} name={user.name} />

        <NavTabs currentTab={tab} setTab={setTab} isAdmin={isAdmin} />

        {tab === 'dashboard' && <HeroSection name={user.name} />}
        {tab === 'shop'       && <Shop items={items} onBuy={buyItem} />}
        {tab === 'purchases'  && <Purchases purchases={purchases} />}
        {tab === 'profile'    && <Profile user={user} onUpdate={updateUserProfile} />}
        {tab === 'admin' && isAdmin && (
          <AdminPanel
            users={users}
            currentUserId={user.id}
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
