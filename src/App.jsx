import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

const API_URL = 'https://expender-tracker-backend-1.onrender.com'

function App() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState('0')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOrder, setSortOrder] = useState('date_desc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchExpenses = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (sortOrder) params.append('sort', sortOrder)

      const response = await fetch(`${API_URL}/expenses?${params}`)
      if (!response.ok) throw new Error('Failed to fetch expenses')

      const data = await response.json()
      setExpenses(data.expenses)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch {
      // Silently fail for categories
    }
  }

  const handleAddExpense = () => {
    fetchCategories()
    fetchExpenses()
  }

  useEffect(() => {
    fetchExpenses()
  }, [selectedCategory, sortOrder])

  useEffect(() => {
    fetchCategories()
  }, [])

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(parseFloat(amount))
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Expense Tracker</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Track where your money goes</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <ExpenseForm onAdd={handleAddExpense} categories={categories} />

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center',
            marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category:</label>
              <select className="input select" value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: '160px' }}>
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sort:</label>
              <select className="input select" value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)} style={{ width: '140px' }}>
                <option value="date_desc">Newest first</option>
                <option value="">Oldest first</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Total ({expenses.length} items)
              </span>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700,
                color: 'var(--color-primary)'
              }}>
                {formatINR(total)}
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              {error}
              <button onClick={fetchExpenses} style={{
                marginLeft: '1rem', textDecoration: 'underline', background: 'none',
                border: 'none', cursor: 'pointer', color: 'inherit'
              }}>Retry</button>
            </div>
          )}

          <ExpenseList expenses={expenses} loading={loading} formatINR={formatINR} />
        </div>
      </div>
    </div>
  )
}

export default App