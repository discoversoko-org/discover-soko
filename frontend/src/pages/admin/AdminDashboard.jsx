import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
    users: 0,
    activeSlides: 0,
    inactiveSlides: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/admin/dashboard");

      const data = res?.data?.data || {};

      setStats({
        approved: data.approved ?? 0,
        rejected: data.rejected ?? 0,
        pending: data.pending ?? 0,
        users: data.users ?? 0,
        activeSlides: data.activeSlides ?? 0,
        inactiveSlides: data.inactiveSlides ?? 0,
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Approved Businesses",
      value: stats.approved,
      className: "approved",
    },
    {
      title: "Pending Businesses",
      value: stats.pending,
      className: "pending",
    },
    {
      title: "Rejected Businesses",
      value: stats.rejected,
      className: "rejected",
    },
    {
      title: "Users",
      value: stats.users,
      className: "users",
    },
    {
      title: "Active Slides",
      value: stats.activeSlides,
      className: "slides",
    },
    {
      title: "Inactive Slides",
      value: stats.inactiveSlides,
      className: "inactive",
    },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="admin">

      {/* CLOSE BUTTON */}
      <button
        className="admin__close"
        onClick={() => navigate("/")}
      >
        ×
      </button>

      <div className="admin__content">

        {/* HEADER 
        <div className="admin__header">
          <h1 className="admin__title">
            AdminDashboard
          </h1>
        </div>  */}

        {/* TABLE */}
        <div className="admin__table-wrapper">

          <table className="admin__table">

            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {cards.map((card) => (
                <tr
                  key={card.title}
                  className={card.className}
                >
                  <td>{card.title}</td>
                  <td>{card.value}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </section>
  );
}