const asyncHandler = require("../../utils/asyncHandler");
const { sendResponse } = require("../../utils/sendResponse");
const businessService = require("../services/business.service");

const {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateObjectId,
} = require("../validations/business.validation")


/* 📌 Get All Approved Businesses */
exports.getApprovedBusinesses = asyncHandler(async (req, res) => {
  const businesses = await businessService.getApprovedBusinesses(req.query);

  sendResponse(res, 200, businesses, "Businesses fetched");
});


/* 📌 Get Single Business */
exports.getBusinessById = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);

  const business = await businessService.getBusinessById(req.params.id);

  sendResponse(res, 200, business, "Business fetched");
});


/* 📌 Create Business */
exports.addBusiness = asyncHandler(async (req, res) => {
  validateCreateBusiness(req.body);

  const business = await businessService.addBusiness({
    ...req.body,
    file: req.file,
    userId: req.user.id,
  });

  sendResponse(res, 201, business, "Business created successfully");
});


/* 📌 Update Business */
exports.updateBusiness = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);
  validateUpdateBusiness(req.body);

  const business = await businessService.updateBusiness({
    id: req.params.id,
    body: req.body,
    file: req.file,
    userId: req.user.id,
    userRole: req.user.role,
  });

  sendResponse(res, 200, business, "Business updated successfully");
});


/* 📌 Delete Business */
exports.deleteBusiness = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);

  await businessService.deleteBusiness({
    id: req.params.id,
    userId: req.user.id,
    userRole: req.user.role,
  });

  sendResponse(res, 200, null, "Business deleted successfully");
});