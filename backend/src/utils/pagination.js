/**
 * 📄 Pagination Utility (MVP ONLY)
 * Minimal, consistent with current backend
 */

const getPagination = (query = {}) => {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 10;

  // Basic safety
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};


/**
 * 📦 Format paginated response (MVP)
 */
const formatPagination = ({ data, total, page, limit }) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


module.exports = {
  getPagination,
  formatPagination,
};