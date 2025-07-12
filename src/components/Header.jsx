function Header({ onLogout, role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'ScamBank'
      case 'Закрывающий': return 'ScamBank'
      default: return 'ScamBank'
    }
  }

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white neon-text">
        <span className="text-green-400">{getCurrencyName(role)}</span>
      </h1>
      <button onClick={onLogout} className="btn btn-success">Выйти</button>
    </header>
  )
}

export default Header
