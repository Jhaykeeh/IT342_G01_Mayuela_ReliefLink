import { useEffect, useState } from 'react';
import api from '../api/api';

function useDashboard(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(path)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, [path]);

  return { data, error };
}

function ProfileCard({ user }) {
  return (
    <div className="card">
      <h3>Profile</h3>
      <p><b>Name:</b> {user.fullName}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Contact:</b> {user.contactNumber || 'N/A'}</p>
      <p><b>Member since:</b> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

function DashboardView({ path, welcome }) {
  const { data, error } = useDashboard(path);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{welcome(data.user.fullName)}</p>
      <ProfileCard user={data.user} />
      {data.stats && (
        <div className="card">
          <h3>User Statistics</h3>
          <div className="stats">
            <div><strong>{data.stats.totalUsers}</strong><span>Total users</span></div>
            <div><strong>{data.stats.requesters}</strong><span>Requesters</span></div>
            <div><strong>{data.stats.donors}</strong><span>Donors</span></div>
            <div><strong>{data.stats.administrators}</strong><span>Admins</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export const RequesterDashboard = () => (
  <DashboardView
    path="/api/requester/dashboard"
    welcome={(n) => `Welcome, ${n}. Submit and track your disaster aid requests here.`}
  />
);

export const DonorDashboard = () => (
  <DashboardView
    path="/api/donor/dashboard"
    welcome={(n) => `Welcome, ${n}. Browse verified requests and make donations here.`}
  />
);

export const AdminDashboard = () => (
  <DashboardView
    path="/api/admin/dashboard"
    welcome={(n) => `Welcome, ${n}. Verify requests and monitor platform activity here.`}
  />
);