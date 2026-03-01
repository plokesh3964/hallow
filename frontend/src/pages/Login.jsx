import { useState } from 'react'
import { login, register, otpSend, otpVerify } from '../api'

const TABS = { password: 'Password', otp: 'OTP' }

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('password')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = isRegister
        ? await register({ username, email, password })
        : await login({ username, password })
      onLogin(data)
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSend(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await otpSend(phone)
      setOtpSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpVerify(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await otpVerify(phone, otp)
      onLogin(data)
    } catch (err) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 360, margin: '2rem auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          {Object.entries(TABS).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => { setTab(k); setError(''); setOtpSent(false); }}
              style={{ marginRight: '0.5rem', background: tab === k ? '#2563eb' : '#eee', color: tab === k ? '#fff' : '#333', border: 'none', padding: '0.5rem 1rem', borderRadius: 6 }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        {tab === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            {isRegister && (
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required={isRegister} />
              </div>
            )}
            <div className="form-group">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="primary" disabled={loading}>
              {isRegister ? 'Register' : 'Login'}
            </button>
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ marginLeft: '0.5rem' }}>
              {isRegister ? 'Login instead' : 'Register'}
            </button>
          </form>
        )}

        {tab === 'otp' && (
          <>
            {!otpSent ? (
              <form onSubmit={handleOtpSend}>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +1234567890" required />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>OTP will be printed in the backend console.</p>
                <button type="submit" className="primary" disabled={loading}>Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify}>
                <div className="form-group">
                  <label>OTP (check backend console)</label>
                  <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6 digits" maxLength={6} required />
                </div>
                <button type="submit" className="primary" disabled={loading}>Verify</button>
                <button type="button" onClick={() => setOtpSent(false)} style={{ marginLeft: '0.5rem' }}>Change phone</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
