import { useEffect, useState } from 'react'

function CasinoSymbolsEditor() {
  const [symbols, setSymbols] = useState([])
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetch('${API_URL}casino/symbols', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then(setSymbols)
  }, [])

  const handleChange = (i, field, value) => {
    const updated = [...symbols]
    updated[i][field] = field === 'symbol' ? value : parseFloat(value)
    setSymbols(updated)
  }

  const handleDelete = async (id) => {
    if (!id) return
    const confirmed = confirm('Удалить этот символ?')
    if (!confirmed) return

    const res = await fetch(`${API_URL}casino/symbols/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    if (res.ok) {
      setSymbols((prev) => prev.filter((s) => s.id !== id))
    } else {
      alert('Ошибка удаления')
    }
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      for (const s of symbols) {
        if (s.id) {
          await fetch(`${API_URL}casino/symbols/${s.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(s),
          })
        } else {
          await fetch(`${API_URL}casino/symbols`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(s),
          })
        }
      }
      alert('Символы обновлены')
    } catch {
      alert('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  const totalWeight = symbols.reduce((sum, s) => sum + (s.weight || 0), 0)

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-purple-400 mb-2">🎰 Символы Казино</h3>
      <div className="space-y-2">
        {symbols.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={s.symbol}
              onChange={(e) => handleChange(i, 'symbol', e.target.value)}
              className="input w-16 text-center"
            />
            <input
              type="number"
              value={s.multiplier}
              onChange={(e) => handleChange(i, 'multiplier', e.target.value)}
              className="input w-24"
            />
            <input
              type="number"
              value={s.weight}
              onChange={(e) => handleChange(i, 'weight', e.target.value)}
              className="input w-24"
            />
            <span className="text-sm text-gray-400 w-24">
              {totalWeight ? ((s.weight / totalWeight) * 100).toFixed(1) + '% шанс' : ''}
            </span>
            <button
              onClick={() => handleDelete(s.id)}
              className="btn btn-danger btn-sm"
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          onClick={() => setSymbols([...symbols, { symbol: '', multiplier: 1, weight: 1 }])}
          className="btn btn-secondary"
        >
          ➕ Добавить символ
        </button>
      </div>
      <button
        onClick={saveChanges}
        className="btn btn-primary mt-4"
        disabled={loading}
      >
        💾 Сохранить
      </button>
    </div>
  )
}

export default CasinoSymbolsEditor
