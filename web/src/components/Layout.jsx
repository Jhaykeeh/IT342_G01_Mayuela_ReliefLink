import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  REQUESTER: [
    ['Dashboard', '/requester/dashboard'],
    ['My Requests', '/requester/requests'],
    ['Submit Request', '/requester/submit'],
    ['Profile', '/requester/profile'],
  ],
  DONOR: [
    ['Dashboard', '/donor/dashboard'],
    ['Browse Requests', '/donor/browse'],
    ['Map', '/donor/map'],
    ['My Donations', '/donor/donations'],
    ['Profile', '/donor/profile'],
  ],
  ADMIN: [
    ['Dashboard', '/admin/dashboard'],
    ['Verify Requests', '/admin/verify'],
    ['Donation Records', '/admin/donations'],
    ['Users', '/admin/users'],
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <header className="navbar">
        <strong>ReliefLink</strong>
        <nav>
          {NAV[user.role].map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-user">
          <span>{user.fullName} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}