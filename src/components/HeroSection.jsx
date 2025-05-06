function HeroSection({ role }) {
  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  return (
    <div className="text-center px-4 py-8 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] max-w-3xl mx-auto">
      <img
        src="/coin.gif"
        alt="Coin"
        className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-4 animate-bounce drop-shadow-xl"
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
        Добро пожаловать в <span className="text-purple-400">{getCurrencyName(role)}</span>
      </h1>
    </div>
  )
}

export default HeroSection
