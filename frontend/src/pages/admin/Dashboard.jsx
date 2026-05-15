import { useEffect, useState } from "react";
import { getPendingBusinesses, getAllUsers } from "../../api/admin.api";

export default function Dashboard() {
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingBusinesses: 0,
    approvedBusinesses: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, usersRes] = await Promise.all([
        getPendingBusinesses(),
        getAllUsers(),
      ]);

      const pending = pendingRes.data?.data || pendingRes.data || [];
      const allUsers = usersRes.data?.data || usersRes.data || [];

      setPendingBusinesses(pending);
      setUsers(allUsers);

      setStats({
        totalUsers: allUsers.length,
        pendingBusinesses: pending.length,
        approvedBusinesses: 0, // TODO: get from API
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Businesses</h3>
          <p>{stats.pendingBusinesses}</p>
        </div>

        <div className="stat-card">
          <h3>Approved Businesses</h3>
          <p>{stats.approvedBusinesses}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <p>Pending businesses: {pendingBusinesses.length}</p>
          <p>Total users: {users.length}</p>
        </div>
      </div>
    </div>
  );
}