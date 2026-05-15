import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { deleteBusiness } from "../../api/business.api";
import "../../styles/MyBusiness.css";

const MyBusinesses = ({ businesses, onRefresh }) => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const wrapperRef = useRef(null);

  /* =========================
     SAFE DATA HANDLING
  ========================= */
  const safeBusinesses = Array.isArray(businesses) ? businesses : [];

  /* =========================
     DEBUG (DEV ONLY)
  ========================= */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log(" MyBusinesses received:", safeBusinesses);
    }
  }, [safeBusinesses]);

  /* =========================
     CLOSE MENU ON OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     DELETE BUSINESS
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;

    try {
      await deleteBusiness(id);
      setOpenMenu(null);
      onRefresh?.();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  /* =========================
     STATUS HELPERS
  ========================= */
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status approved";
      case "pending":
        return "status pending";
      case "rejected":
        return "status rejected";
      default:
        return "status";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "";
      case "pending":
        return "";
      case "rejected":
        return "";
      default:
        return "";
    }
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (!safeBusinesses.length) {
    return (
      <div className="businesses">
        <div className="businesses__header">
          

          <button
            className="add-btn"
            onClick={() => navigate("/user/business/create")}
          >
            + Add Business
          </button>
        </div>

        <div className="businesses__empty">
          <p>No businesses found.</p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="businesses" ref={wrapperRef}>

      {/* HEADER */}
      <div className="businesses__header">
        

        <button
          className="add-btn"
          onClick={() => navigate("/user/business/create")}
        >
          + Add Business
        </button>
      </div>

      {/* GRID */}
      <div className="businesses__grid">

        {safeBusinesses.map((biz) => {
          const id = biz?._id || biz?.id;

          return (
            <div key={id} className="biz-card">

              {/* IMAGE */}
              <img
                src={biz?.image?.url || "/placeholder.jpg"}
                alt={biz?.name || "business"}
                className="biz-card__image"
              />

              <div className="biz-card__body">

                {/* HEADER */}
                <div className="biz-card__header">
                  <h3>{biz?.name || "Unnamed"}</h3>

                  <div className="menu">
                    <button
                      className="menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === id ? null : id);
                      }}
                    >
                      ⋮
                    </button>

                    {openMenu === id && (
                      <div className="menu-dropdown">
                        <button
                          onClick={() =>
                            navigate(`/user/business/edit/${id}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger"
                          onClick={() => handleDelete(id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

               {/* DESCRIPTION */}
                <p className="biz-card__desc">
                  {biz?.description || "No description"}
                </p>

                            
                {/* META */}
                <div className="biz-card__meta">
                  <span>{biz?.category || "N/A"}</span>
                  <span>{biz?.location || "N/A"}</span>
                  <span>{biz?.contact || "N/A"}</span>
                </div>
                
                
                {/* STATUS */}
                <div className={getStatusClass(biz?.status)}>
                  {getStatusIcon(biz?.status)} {biz?.status || "unknown"}
                </div>

                {/* REJECTION */}
                {biz?.status === "rejected" && (
                  <div className="biz-card__rejection">
                    <strong>Reason:</strong>
                    <p>{biz?.rejectionReason || "Not specified"}</p>
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MyBusinesses;