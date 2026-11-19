import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext';

export default function Login() {
  const { login, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token && user) return <Navigate to={dashboardPath(user.role)} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(dashboardPath(u.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <h2>Login to ReliefLink</h2>
      {location.state?.message && <p className="success">{location.state.message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}