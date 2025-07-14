import { useState } from 'react';

/**
 * Компонент используется ДВАЖДЫ:
 *   • как форма логина — когда передан prop onLogin;
 *   • как сплеш-экран «Главная» — когда пользователь уже в системе.
 *
 * Если onLogin === undefined → показываем приветствие,
 * иначе — форму авторизации.
 */

/* Базовый URL API. На проде приходит из переменной окружения
   VITE_API_URL (Render / Netlify). Локально падаем на '/api'. */
const API_URL = import.meta.env.VITE_API_URL || '/api';

function HeroSection({ onLogin, name }) {
  /* ------------------------------------------------------------------
   * 1. Пользователь уже вошёл – просто приветствуем
   * ------------------------------------------------------------------ */
  if (!onLogin) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <img src="/coin.gif" alt="coin" className="w-32 animate-pulse" />
        <h2 className="text-3xl font-bold">
          Добро пожаловать{ name ? `, ${name}!` : '!' }
        </h2>
        <p className="text-zinc-400">
          Выберите вкладку сверху, чтобы начать работу.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * 2. Форма входа
   * ------------------------------------------------------------------ */
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (res.ok) {
        /* Передаём наверх и даём App сохранить токен + user */
        onLogin(data);
      } else {
        setError(data.error || 'Неверные учётные данные');
      }
    } catch {
      setError('Сервер недоступен');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <img src="/coin.gif" alt="coin" className="w-32" />

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <input
          placeholder="Логин"
          value={loginData.login}
          onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded">
          Войти
        </button>
      </form>
    </div>
  );
}

export default HeroSection;
