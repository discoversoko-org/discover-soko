import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/user.api";
import { useLocation, useNavigate } from "react-router-dom";

import MyBusinesses from "../../components/dashboard/MyBusinesses";
import Profile from "./Profile";

import "../../styles/Dashboard.css";

export default function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [location.state?.refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getUserProfile();

      const currentUser =
        res.data?.data?.user ||
        res.data?.data ||
        res.data;

      const myBusinesses = Array.isArray(currentUser?.businesses)
        ? currentUser.businesses
        : [];

      setBusinesses(myBusinesses);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     ONLY LOADER (NO WRAPPER UI)
  ======================================== */
  if (loading) {
    return (
      <div className="dashboard__loading">
        Loading...
      </div>
    );
  }

  return (
    <>
      
      {/* PROFILE (NO EXTRA WRAPPER CONTAINER) */}
      <div className="dashboard__profileWrapper">
        <Profile />
      </div>

      {/* BUSINESSES (NO EXTRA WRAPPERS OR HEADERS) */}
      <div className="dashboard__businessWrapper">
        <MyBusinesses
          businesses={businesses}
          onRefresh={fetchData}
        />
      </div>
    </>
  );
}