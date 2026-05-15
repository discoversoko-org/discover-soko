import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPendingBusinesses,
  approveBusiness,
  rejectBusiness,
} from "../../api/admin.api";

import "../../styles/BusinessApproval.css";

export default function BusinessApproval() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingBusinesses();
  }, []);

  /* =========================
     FETCH PENDING BUSINESSES
  ========================= */
  const fetchPendingBusinesses = async () => {
    try {
      const response =
        await getPendingBusinesses();

      const data =
        response.data?.data ||
        response.data ||
        [];

      setBusinesses(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error fetching pending businesses:",
        error.response?.data || error.message
      );

      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     APPROVE BUSINESS
  ========================= */
  const handleApprove = async (id) => {
    try {
      await approveBusiness(id);

      setBusinesses((prev) =>
        prev.filter(
          (biz) =>
            (biz.id || biz._id) !== id
        )
      );
    } catch (error) {
      console.error(
        "Error approving business:",
        error.response?.data || error.message
      );
    }
  };

  /* =========================
     REJECT BUSINESS
  ========================= */
  const handleReject = async (
    id,
    reason
  ) => {
    try {
      await rejectBusiness(id, reason);

      setBusinesses((prev) =>
        prev.filter(
          (biz) =>
            (biz.id || biz._id) !== id
        )
      );
    } catch (error) {
      console.error(
        "Error rejecting business:",
        error.response?.data || error.message
      );
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="business-approval-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="business-approval">

      {/* CLOSE BUTTON */}
      <button
        className="business-approval__close"
        onClick={() => navigate("/")}
      >
        ×
      </button>

      {/*<h1 className="business-approval__title">
        Business Approval
      </h1> */}

      {businesses.length === 0 ? (
        <p className="business-approval__empty">
          No pending businesses to review.
        </p>
      ) : (
        <div className="business-approval__list">
          {businesses.map((business) => (
            <div
              key={
                business.id ||
                business._id
              }
              className="business-approval__card"
            >
              <div className="business-approval__info">
                <h3>{business.name}</h3>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {business.location}
                </p>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {business.category}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>{" "}
                  {business.description}
                </p>

                <p>
                  <strong>
                    Contact:
                  </strong>{" "}
                  {business.contact}
                </p>

                <p>
                  <strong>Owner:</strong>{" "}
                  {business.owner?.name} (
                  {
                    business.owner
                      ?.email
                  }
                  )
                </p>

                {business.image?.url && (
                  <img
                    src={
                      business.image.url
                    }
                    alt={business.name}
                    className="business-approval__image"
                    onError={(e) => {
                      e.target.src =
                        "/placeholder.png";
                    }}
                  />
                )}
              </div>

              <div className="business-approval__actions">
                <button
                  onClick={() =>
                    handleApprove(
                      business.id ||
                        business._id
                    )
                  }
                  className="business-approval__approve-btn"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    const reason =
                      prompt(
                        "Rejection reason:"
                      );

                    if (reason) {
                      handleReject(
                        business.id ||
                          business._id,
                        reason
                      );
                    }
                  }}
                  className="business-approval__reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}