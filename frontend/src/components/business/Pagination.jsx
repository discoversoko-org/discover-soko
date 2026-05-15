const Pagination = ({ pagination, setPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        disabled={!pagination.hasPrevPage}
        onClick={() => setPage((prev) => prev - 1)}
      >
        Prev
      </button>

      <span style={{ margin: "0 10px" }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        disabled={!pagination.hasNextPage}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;