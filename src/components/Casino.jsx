import { useState } from 'react'
import { toast } from 'react-toastify'

function Casino({ balance, refreshUser, role }) {
  const [bet, setBet] = useState(50)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [spinIcons, setSpinIcons] = useState(["❓", "❓", "❓"])

  const getCurrencyName = (role) => {
    switch (role) {
      case 'Гос': return 'Andriana-Coin'
      case 'Закрывающий': return 'Rezak-Coin'
      default: return 'Sknk-Coin'
    }
  }

  const spinSlots = async () => {
    if (spinning || bet > balance || balance <= 0) return

    setSpinning(true)
    setResult(null)

    let intervalId = setInterval(() => {
      const randomIcons = ["🍒", "🍋", "💎", "🔔", "7️⃣"]
      setSpinIcons([
        randomIcons[Math.floor(Math.random() * randomIcons.length)],
        randomIcons[Math.floor(Math.random() * randomIcons.length)],
        randomIcons[Math.floor(Math.random() * randomIcons.length)],
      ])
    }, 100)

    try {
      const res = await fetch('http://localhost:3000/api/casino/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ betAmount: bet }),
      })

      const data = await res.json()

      setTimeout(() => {
        clearInterval(intervalId)
        setSpinning(false)
        if (res.ok && data.icons && typeof data.win === 'number') {
          setResult({ symbols: data.icons, win: data.win })
          setSpinIcons(data.icons)
          if (refreshUser) refreshUser()
          if (data.win > 0) toast.success(`Вы выиграли ${data.win} ${getCurrencyName(role)}!`)
          else toast.info('Не повезло, попробуйте ещё.')
        } else {
          toast.error(data.error || 'Ошибка во время спина')
        }
      }, 1500)
    } catch {
      clearInterval(intervalId)
      setSpinning(false)
      toast.error('Ошибка при ставке в казино')
    }
  }

  return (
    <div className="fade-in space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-purple-400 text-center">🎰 Казино</h2>

      <div className="flex items-center gap-4">
        <label>Ставка:</label>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value))}
        />
        <span className="text-purple-300 font-bold">{bet} {getCurrencyName(role)}</span>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6 flex justify-center text-5xl space-x-6 border border-purple-700">
        {spinIcons.map((s, i) => (
          <div key={i} className={`transition-all ${spinning ? 'animate-pulse' : ''}`}>{s}</div>
        ))}
      </div>

      <button
        onClick={spinSlots}
        disabled={spinning || bet > balance || balance <= 0}
        className="btn btn-primary w-full disabled:opacity-40"
      >
        {spinning ? 'Крутим...' : 'Крутить'}
      </button>
    </div>
  )
}

export default Casino
