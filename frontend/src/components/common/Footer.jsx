const Footer = () => {
  return (
    <footer style={{ padding: "20px", textAlign: "center", background: "#f8fafc" }}>
      <p style={{ margin: 0, color: "#475569" }}>
        © {new Date().getFullYear()} Billboard App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
