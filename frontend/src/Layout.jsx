import { Outlet, Link } from 'react-router-dom'

export default function Layout({ token, user, onLogout }) {
  return (
    <>
      <nav>
        <Link to="/catalog">Catalog</Link>
        {token ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <span style={{ marginLeft: 'auto' }}>{user?.username}</span>
            <button type="button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
