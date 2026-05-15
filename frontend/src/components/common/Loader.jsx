const Loader = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid #ddd",
        borderTop: "4px solid #5d5d5d",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
