import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getBusinesses } from "../../api/business.api";
import "../../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* =========================
     SAFE USER
  ========================= */
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch (err) {
      console.error("Invalid user JSON:", err);
      return null;
    }
  };

  /* =========================
     STATE
  ========================= */
  const [currentUser, setCurrentUser] = useState(
    getStoredUser() || user || {}
  );

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* =========================
     SYNC USER
  ========================= */
  useEffect(() => {
    setCurrentUser(getStoredUser() || user || {});
  }, [user]);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getBusinesses({ page: 1, limit: 100 });

        const businesses = res.data?.data?.data || res.data?.data || [];

        const uniqueCategories = [
          ...new Set(businesses.map((b) => b.category).filter(Boolean)),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     CLOSE DROPDOWN
  ========================= */
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    setOpenDropdown(null);
    navigate("/auth");
  };

  /* =========================
     AVATAR
  ========================= */
  const avatar =
    currentUser?.avatar?.url ||
    currentUser?.avatar ||
    "/avatar.png";

  return (
    <nav className="navbar">
      {/* BRAND + MOBILE TOGGLE */}
      <div className="navbar__left">
        <h1 className="navbar__brand" onClick={() => navigate("/")}>
          Billboard
        </h1>

    
        <div className={`navbar__links ${mobileOpen ? "open" : ""}`}>
          
          {/* CATEGORY */}
          <div
            className="navbar__dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="navbar__link"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "category" ? null : "category"
                )
              }
            >
              Category ▾
            </span>

            <div
              className={`navbar__dropdown-menu ${
                openDropdown === "category" ? "active" : ""
              }`}
            >
              <Link to="/" onClick={() => setOpenDropdown(null)}>
                All
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar__right">
        {currentUser?._id ? (
          <div
            className="navbar__user"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${avatar}?t=${Date.now()}`}
              alt="user"
              className="navbar__avatar"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "user" ? null : "user"
                )
              }
              onError={(e) => {
                e.target.src = "/avatar.png";
              }}
            />

            <div
              className={`navbar__dropdown-menu right ${
                openDropdown === "user" ? "active" : ""
              }`}
            >
              <Link to="/user/dashboard" onClick={() => setOpenDropdown(null)}>
                Dashboard
              </Link>

              {currentUser?.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setOpenDropdown(null)}>
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin/business-approval"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Approve Businesses
                  </Link>

                  <Link
                    to="/admin/hero-slides"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Hero Slides
                  </Link>
                </>
              )}

              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="navbar__icon" onClick={() => navigate("/auth")}>
            <i className="fas fa-user" />
          </div>
        )}
      </div>
    </nav>
  );
}