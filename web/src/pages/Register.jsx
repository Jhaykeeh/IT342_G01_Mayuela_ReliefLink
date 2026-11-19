import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', contactNumber: '', password: '', confirmPassword: '', role: 'DONOR',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.contactNumber && !/^[0-9+\-\s]{7,20}$/.test(form.contactNumber)) {
      e.contactNumber = 'Invalid contact number';
    }
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        contactNumber: form.contactNumber,
      });
      navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      setServerError(data?.message || 'Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text') => (
    <>
      <label>{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </>
  );

  return (
    <div className="card auth-card">
      <h2>Create an account</h2>
      {serverError && <p className="error">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        {field('fullName', 'Full name')}
        {field('email', 'Email', 'email')}
        {field('contactNumber', 'Contact number (optional)')}
        {field('password', 'Password', 'password')}
        {field('confirmPassword', 'Confirm password', 'password')}
        <label>Register as</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="DONOR">Donor</option>
          <option value="REQUESTER">Requester</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}