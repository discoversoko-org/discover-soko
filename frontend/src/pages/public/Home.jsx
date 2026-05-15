import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBusinesses } from "../../api/business.api";
import { getActiveSlides } from "../../api/hero.api";

import HeroSlider from "../../components/hero/HeroSlider";
import BusinessCard from "../../components/business/BusinessCard";
import Pagination from "../../components/business/Pagination";
import SkeletonCard from "../../components/business/SkeletonCard";

const Home = () => {
  const { category } = useParams();

  const [slides, setSlides] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {
    try {
      const [slideRes, businessRes] = await Promise.all([
        getActiveSlides(),
        getBusinesses({
          page,
          limit: 10,
        }),
      ]);

      return {
        slides: slideRes.data?.data || [],
        businesses: businessRes.data?.data?.data || [],
        pagination: businessRes.data?.data?.pagination || {},
      };
    } catch (err) {
      console.error("Homepage error:", err);
      return {
        slides: [],
        businesses: [],
        pagination: {},
      };
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);

      const { slides, businesses, pagination } = await fetchData();

      if (ignore) return;

      setSlides(slides);
      setPagination(pagination);

      const normalizedCategory = category
        ? decodeURIComponent(category).toLowerCase().trim()
        : null;

      const filtered =
        normalizedCategory && normalizedCategory !== "all"
          ? businesses.filter(
              (b) =>
                b?.category?.toLowerCase().trim() === normalizedCategory
            )
          : businesses;

      setBusinesses(filtered);

      setLoading(false);
    };

    load();

    return () => {
      ignore = true;
    };
  }, [page, category]);

  return (
    <main className="home">

      {/* =========================
          HERO SECTION (GLOBAL.CSS BLOCK)
      ========================= */}
      <section className="home__hero">
        <HeroSlider slides={slides} />
      </section>

      {/* =========================
          BUSINESS SECTION
      ========================= */}
      <section className="home__business">

        {/* HEADER */}
        <header className="home__header">
          <h2 className="home__title">
            {category && category.toLowerCase() !== "all"
              ? `${decodeURIComponent(category)} Businesses`
              : "Explore Businesses"}
          </h2>
        </header>

        {/* GRID WRAPPER */}
        <div className="home__grid">

          {loading ? (
            <div className="home__skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <div className="home__business-grid">
              {businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="home__empty">
              <h3>No businesses found</h3>
            
            </div>
          )}

        </div>

        {/* PAGINATION BLOCK */}
        {!loading &&
          businesses.length > 0 &&
          (!category || category.toLowerCase() === "all") && (
            <div className="home__pagination">
              <Pagination
                pagination={pagination}
                setPage={setPage}
              />
            </div>
          )}

      </section>

    </main>
  );
};

export default Home;