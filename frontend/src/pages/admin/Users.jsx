import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/admin.api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="users-management">
      <h1>Manage Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Name</th>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Role</th>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{user.name}</td>
                <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{user.email}</td>
                <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{user.role || "user"}</td>
                <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
