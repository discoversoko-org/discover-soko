const MyReviews = ({ reviews }) => {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2>My Reviews</h2>
      {reviews.length === 0 ? (
        <p style={{ color: "#64748b" }}>You haven't written any reviews yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((review) => (
            <li
              key={review._id}
              style={{
                padding: "12px",
                marginBottom: "8px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                background: "#f8fafc",
              }}
            >
              <strong>{review.businessName}</strong> - Rating: {review.rating}/5
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReviews;
