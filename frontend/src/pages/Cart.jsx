import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, cartRemove, orderSummary } from '../api'

export default function Cart({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function loadCart() {
    getCart(token)
      .then(setItems)
      .catch(() => setError('Failed to load cart'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCart()
  }, [token])

  async function handleRemove(itemId) {
    setError('')
    try {
      await cartRemove(token, itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch {
      setError('Failed to remove')
    }
  }

  async function handleCheckout() {
    setError('')
    setSubmitting(true)
    try {
      await orderSummary(token)
      navigate('/orders')
    } catch (err) {
      setError(err.message || 'Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const total = items.reduce((sum, i) => sum + Number(i.product?.price || 0) * i.quantity, 0)

  if (loading) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="container">
      <h1>Cart</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="card">
            {items.map((i) => (
              <div key={i.id} className="cart-row">
                <div>
                  <strong>{i.product?.name}</strong>
                  <span style={{ marginLeft: '0.5rem' }}>× {i.quantity}</span>
                </div>
                <div>
                  <span style={{ marginRight: '1rem' }}>${(Number(i.product?.price || 0) * i.quantity).toFixed(2)}</span>
                  <button type="button" onClick={() => handleRemove(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <p><strong>Total: ${total.toFixed(2)}</strong></p>
          <button className="primary" onClick={handleCheckout} disabled={submitting}>
            {submitting ? 'Creating order…' : 'Proceed to order summary'}
          </button>
        </>
      )}
    </div>
  )
}
