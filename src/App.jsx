import { useEffect, useState } from 'react';
import Header        from './components/Header';
import NavTabs       from './components/NavTabs';
import BalanceCard   from './components/BalanceCard';
import HeroSection   from './components/HeroSection';
import Shop          from './components/Shop';
import Purchases     from './components/Purchases';
import Profile       from './components/Profile';
import AdminPanel    from './components/AdminPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  /* ═════════════  state  ═════════════ */
  const [token, setToken]       = useState(() => localStorage.getItem('token') || '');
  const [user, setUser]         = useState(null);
  const [balance, setBalance]   = useState(0);
  const [tab, setTab]           = useState('dashboard');
  const [items, setItems]       = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers]       = useState([]);

  const isAdmin   = user?.is_admin;
  const authHdr   = () => ({ Authorization: `Bearer ${token}` });

  /* ═════════════  login  ═════════════ */
  const handleLogin = ({ token: t, user: u }) => {
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    setBalance(u.balance);
  };

  /* ═════════════  fetch helpers  ═════════════ */
  const fetchUser = async () => {
    const r = await fetch(`${API_URL}/me`, { headers: authHdr() });
    if (r.ok) {
      const d = await r.json();
      setUser(d); setBalance(d.balance);
    }
  };
  const fetchItems      = async () => {
    const r = await fetch(`${API_URL}/items`, { headers: authHdr() });
    if (r.ok) setItems(await r.json());
  };
  const fetchPurchases  = async () => {
    const r = await fetch(`${API_URL}/my-purchases`, { headers: authHdr() });
    if (r.ok) setPurchases(await r.json());
  };
  const fetchUsers      = async () => {
    const r = await fetch(`${API_URL}/users`, { headers: authHdr() });
    if (r.ok) setUsers(await r.json());
  };

  /* ═════════════  effects  ═════════════ */
  useEffect(() => {
    if (!token) return;
    fetchUser(); fetchItems(); fetchPurchases();
  }, [token]);

  useEffect(() => { if (user?.is_admin) fetchUsers(); }, [user?.is_admin]);
  useEffect(() => { if (tab === 'admin' && user?.is_admin) fetchUsers(); }, [tab, user?.is_admin]);

  /* ═════════════  actions  ═════════════ */
  const buyItem = async (itemId) => {
    const r = await fetch(`${API_URL}/buy`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHdr() },
      body: JSON.stringify({ item_id: itemId }),
    });
    const d = await r.json();
    if (r.ok) {
      toast.success('Покупка успешна!');
      fetchUser(); fetchPurchases(); setTab('purchases');
    } else toast.error(d.error || 'Ошибка покупки');
  };

  const giveCoins = async (id, amount) => {
    const r = await fetch(`${API_URL}/users/${id}/coins`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', ...authHdr() },
      body:JSON.stringify({ amount }),
    });
    if (!r.ok) return toast.error('Ошибка начисления');

    /* мгновенно обновляем state */
    setUsers(p => p.map(u => u.id === id ? { ...u, balance: u.balance + amount } : u));
    if (id === user.id) {
      setBalance(b => b + amount);
      setUser(u => ({ ...u, balance: u.balance + amount }));
    }
    toast.success(`+${amount} ScamCoin`);
  };

  const deleteUser = async (id) => {
    const r = await fetch(`${API_URL}/users/${id}`, { method:'DELETE', headers: authHdr() });
    if (r.ok) {
      toast.success('Пользователь удалён');
      setUsers(p => p.filter(u => u.id !== id));
    } else toast.error('Ошибка удаления');
  };

  const addUser = async (form) => {
    const r = await fetch(`${API_URL}/register`, {
      method:'POST', headers:{ 'Content-Type':'application/json', ...authHdr() },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (r.ok) { toast.success('Пользователь создан'); fetchUsers(); return true; }
    toast.error(d.error || 'Ошибка регистрации'); return false;
  };

  const addItem = async (fd) => {
    const r = await fetch(`${API_URL}/items`, { method:'POST', headers: authHdr(), body: fd });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { toast.success('Товар добавлен'); fetchItems(); return true; }
    toast.error(d.error || 'Ошибка добавления'); return false;
  };

  const deleteItem = async (id) => {
    const r = await fetch(`${API_URL}/items/${id}`, { method:'DELETE', headers: authHdr() });
    if (r.ok) { toast.success('Товар удалён'); setItems(p => p.filter(it => it.id !== id)); }
    else toast.error('Ошибка удаления');
  };

  const updateUserProfile = (u) => setUser(p => ({ ...p, ...u }));

  const handleLogout = () => { localStorage.removeItem('token'); location.reload(); };

  /* ═════════════  render  ═════════════ */
  if (!token || !user) return <HeroSection onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 font-mono">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <Header onLogout={handleLogout} />
        <BalanceCard balance={balance} name={user.name} />
        <NavTabs currentTab={tab} setTab={setTab} isAdmin={isAdmin} />

        {tab === 'dashboard' && <HeroSection name={user.name} />}
        {tab === 'shop'       && <Shop       items={items} onBuy={buyItem} />}
        {tab === 'purchases'  && <Purchases  purchases={purchases} />}
        {tab === 'profile'    && <Profile    user={user} onUpdate={updateUserProfile} />}
        {tab === 'admin' && isAdmin && (
          <AdminPanel
            users={users}
            currentUserId={user.id}
            giveCoins={giveCoins}
            deleteUser={deleteUser}
            addUser={addUser}
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
