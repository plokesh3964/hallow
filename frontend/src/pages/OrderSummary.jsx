import { useState, useEffect } from 'react'
import { getOrders } from '../api'

export default function OrderSummary({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getOrders(token)
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>

  return (
    <div className="container">
      <h1>Order summary</h1>
      <p>No payment integration — orders are for summary only.</p>
      {orders.length === 0 ? (
        <p>No orders yet. Add items to cart and checkout.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Order #{order.id}</strong>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <p>Status: {order.status} · Total: ${Number(order.total_amount).toFixed(2)}</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {order.items?.map((item) => (
                <li key={item.id}>
                  {item.product_name} × {item.quantity} — ${(Number(item.price) * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}
