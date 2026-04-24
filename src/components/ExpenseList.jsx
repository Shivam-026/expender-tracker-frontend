function ExpenseList({ expenses, loading, formatINR }) {
  if (loading && expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        Loading expenses...
      </div>
    )
  }
  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        No expenses yet. Add your first expense above!
      </div>
    )
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{
            borderBottom: '2px solid var(--color-border)', textAlign: 'left', fontSize: '0.75rem',
            fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em'
          }}>
            <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
            <th style={{ padding: '0.75rem 0.5rem' }}>Description</th>
            <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id} style={{
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
            }}>
              <td style={{ padding: '0.875rem 0.5rem', fontSize: '0.9375rem' }}>
                {formatDate(expense.date)}
              </td>
              <td style={{ padding: '0.875rem 0.5rem' }}>
                <span style={{
                  display: 'inline-block', padding: '0.125rem 0.625rem', backgroundColor: 'var(--color-bg)',
                  borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-muted)'
                }}>
                  {expense.category}
                </span>
              </td>
              <td style={{
                padding: '0.875rem 0.5rem', fontSize: '0.9375rem',
                color: expense.description ? 'var(--color-text)' : 'var(--color-text-muted)',
                fontStyle: expense.description ? 'normal' : 'italic'
              }}>
                {expense.description || '-'}
              </td>
              <td style={{
                padding: '0.875rem 0.5rem', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums'
              }}>
                {formatINR(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList
