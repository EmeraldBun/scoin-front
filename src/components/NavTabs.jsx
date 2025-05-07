function NavTabs({ currentTab, setTab, isAdmin, role }) {
  const tabs = [
    { id: 'dashboard', label: 'Пользователь', icon: '👤' },
    { id: 'shop', label: 'Магазин', icon: '🛒' },
    { id: 'purchases', label: 'Мои покупки', icon: '🛍️' },
    { id: 'profile', label: 'Профиль', icon: '⚙️' },
    { id: 'admin', label: 'Админка', icon: '🛠' },
  ]

  return (
    <div className="flex justify-center">
      {tabs.map(
        (tab) =>
          (tab.id !== 'admin' || isAdmin) && (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`tab-btn ${currentTab === tab.id ? 'border border-purple-500 bg-purple-900' : ''}`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          )
      )}
    </div>
  )
}

export default NavTabs
