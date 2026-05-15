import BusinessCard from "./BusinessCard";

const BusinessList = ({ businesses, loading }) => {
  if (loading) {
    return <div style={{ padding: "20px" }}>Loading businesses...</div>;
  }

  if (!businesses || businesses.length === 0) {
    return <div style={{ padding: "20px" }}>No businesses available.</div>;
  }

  return (
    <div className="business-list">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {businesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default BusinessList;
