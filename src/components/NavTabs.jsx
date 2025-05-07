import React from 'react';
import { FaShoppingCart, FaUser, FaCogs, FaHome, FaCoins } from 'react-icons/fa';

const NavTabs = ({ currentTab, setTab, isAdmin, role }) => {
  const tabs = [
    { id: 'dashboard', label: 'Главная', icon: <FaHome /> },
    { id: 'shop', label: 'Магазин', icon: <FaShoppingCart /> },
    { id: 'purchases', label: 'Покупки', icon: <FaCoins /> },
    { id: 'profile', label: 'Профиль', icon: <FaUser /> },
    { id: 'admin', label: 'Админка', icon: <FaCogs /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
      {tabs.map(
        (tab) =>
          (tab.id !== 'admin' || isAdmin) && (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`tab-btn text-sm sm:text-base px-3 py-2 rounded-lg border transition duration-200 ${
                currentTab === tab.id
                  ? 'border-purple-500 bg-purple-900 text-white'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          )
      )}
    </div>
  );
};

export default NavTabs;
