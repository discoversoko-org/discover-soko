import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBusinesses } from "../../api/business.api";

export default function CategoryPage() {
  const { category } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getBusinesses();

        const all =
          res.data?.data?.data ||
          res.data?.data ||
          [];

        const filtered = all.filter(
          (b) =>
            b.category?.toLowerCase() ===
            category?.toLowerCase()
        );

        setBusinesses(filtered);
      } catch (err) {
        console.error("Category fetch error:", err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div style={{ paddingTop: "80px", paddingLeft: "20px" }}>
      <h2>
        Category:{" "}
        <span style={{ textTransform: "capitalize" }}>
          {category}
        </span>
      </h2>

      {/* LOADING STATE */}
      {loading && <p>Loading businesses...</p>}

      {/* EMPTY STATE */}
      {!loading && businesses.length === 0 && (
        <p>No businesses found in this category.</p>
      )}

      {/* LIST */}
      <div style={{ marginTop: "20px" }}>
        {businesses.map((b) => (
          <div
            key={b._id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            <h3>{b.name}</h3>
            <p>{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}