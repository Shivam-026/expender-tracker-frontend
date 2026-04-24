import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const COMMON_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Other']

function ExpenseForm({ onAdd, categories }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!formData.category.trim()) {
      setError('Category is required')
      return
    }

    setSubmitting(true)
    setError(null)
    const clientId = uuidv4()
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${API_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            amount: amount.toFixed(2),
            category: formData.category.trim(),
            description: formData.description.trim() || null,
            date: formData.date,
          }),
        })

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err.detail || 'Failed to create expense')
        }

        const newExpense = await response.json()
        onAdd(newExpense)
        setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
        break
      } catch (err) {
        attempts++
        if (attempts >= maxAttempts) {
          setError(`Failed after ${maxAttempts} attempts: ${err.message}`)
        } else {
          await new Promise((r) => setTimeout(r, 1000 * attempts))
        }
      }
    }
    setSubmitting(false)
  }

  const allCategories = [...new Set([...COMMON_CATEGORIES, ...categories])]

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                Amount (&#8377;)
              </label>
              <input type="number" step="0.01" min="0.01" className="input"
                value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00" disabled={submitting} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                Date
              </label>
              <input type="date" className="input" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} disabled={submitting} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>
              Category
            </label>
            <input type="text" list="category-options" className="input" value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Food, Transport" disabled={submitting} required />
            <datalist id="category-options">
              {allCategories.map((cat) => (<option key={cat} value={cat} />))}
            </datalist>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>
              Description <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="text" className="input" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What was this for?" disabled={submitting} />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: '120px' }}>
              {submitting ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
