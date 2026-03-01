import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, cartAdd } from '../api'

export default function Catalog({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(productId) {
    if (!token) return
    setAddingId(productId)
    setError('')
    try {
      await cartAdd(token, productId, 1)
    } catch (err) {
      setError(err.message || 'Failed to add')
    } finally {
      setAddingId(null)
    }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description || '—'}</p>
            <span className="price">${Number(p.price).toFixed(2)}</span>
            {token && (
              <button
                className="primary"
                onClick={() => handleAdd(p.id)}
                disabled={addingId === p.id || p.stock === 0}
              >
                {addingId === p.id ? 'Adding…' : 'Add to cart'}
              </button>
            )}
            {!token && <Link to="/login">Login to add to cart</Link>}
          </div>
        ))}
      </div>
    </div>
  )
}
