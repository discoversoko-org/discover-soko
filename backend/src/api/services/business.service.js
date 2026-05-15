const businessRepository = require("../repositories/business.repository");
const cloudinary = require("../../config/cloudinary");
const { getPagination, formatPagination } = require("../../utils/pagination");

const MAX_BUSINESSES = 2;


/* 📌 GET APPROVED BUSINESSES (PAGINATED) */
const getApprovedBusinesses = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const category = query.category;

  const businesses = await businessRepository.findApprovedBusinesses(skip, limit, category);

  const total = await businessRepository.countApprovedBusinesses(category);

  return formatPagination({
    data: businesses,
    total,
    page,
    limit,
  });
};


/* 📌 GET BY ID */
const getBusinessById = async (id) => {
  const business = await businessRepository.findBusinessById(id);

  if (!business) {
    throw { status: 404, message: "Business not found" };
  }

  return business;
};


/* 📌 CREATE */
const addBusiness = async ({ name, location, category, description, contact, file, userId }) => {
  const count = await businessRepository.countActiveBusinessesByOwner(userId);

  if (count >= MAX_BUSINESSES) {
    throw {
      status: 403,
      message:"You can only create up to 2 businesses",
    };
  }

  const business = await businessRepository.createBusiness({
    name,
    location,
    category,
    description: description || "",
    contact: contact || "",
    image: file
      ? { url: file.path, public_id: file.filename }
      : { url: "", public_id: "" },
    owner: userId,
    status: "pending",
  });

  await businessRepository.addBusinessToUser(userId, business._id);

  return business;
};


/* 📌 UPDATE */
const updateBusiness = async ({ id, body, file, userId, userRole }) => {
  const business = await getBusinessById(id);

  const isOwner = business.owner._id.toString() === userId;
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw { status: 403, message: "Not authorized" };
  }

  if (file && business.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(business.image.public_id);
    } catch (err) {
      console.error(err.message);
    }
  }

  const updateData = {
    name: body.name ?? business.name,
    location: body.location ?? business.location,
    category: body.category ?? business.category,
    description: body.description ?? business.description,
    contact: body.contact ?? business.contact,
  };

  if (file) {
    updateData.image = {
      url: file.path,
      public_id: file.filename,
    };
  }

  if (!isAdmin) {
    updateData.status = "pending";
  }

  return businessRepository.updateBusinessById(id, updateData);
};


/* 📌 DELETE */
const deleteBusiness = async ({ id, userId, userRole }) => {
  const business = await getBusinessById(id);

  const isOwner = business.owner._id.toString() === userId;
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw { status: 403, message: "Not authorized" };
  }

  if (business.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(business.image.public_id);
    } catch (err) {
      console.error(err.message);
    }
  }

  await businessRepository.deleteBusiness(business);

  await businessRepository.removeBusinessFromUser(
    business.owner._id,
    business._id
  );

  return true;
};


module.exports = {
  getApprovedBusinesses,
  getBusinessById,
  addBusiness,
  updateBusiness,
  deleteBusiness,
};