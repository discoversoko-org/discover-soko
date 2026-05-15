const StatsCard = ({ title, value }) => {
  return (
    <div style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", textAlign: "center" }}>
      <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#64748b" }}>{title}</p>
      <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1e293b" }}>{value}</p>
    </div>
  );
};

export default StatsCard;
