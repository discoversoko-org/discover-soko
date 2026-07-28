const User = require(
  "../../models/User"
);

/* =========================================
   BASE QUERY
========================================= */

const baseUserQuery = () => {
  return User.find().select(
    "-password -refreshToken"
  );
};

/* =========================================
   FIND USER BY ID
========================================= */

const findUserById =
  async (userId) => {
    return User.findById(
      userId
    )
      .populate({
        path:
          "businesses",

        select:
          "name category description location contact image status owner createdAt updatedAt",
      })
      .select(
        "-password -refreshToken"
      );
  };

/* =========================================
   FIND USER WITH PASSWORD
========================================= */

const findUserWithPassword =
  async (userId) => {
    return User.findById(
      userId
    ).select("+password");
  };

/* =========================================
   FIND USER BY EMAIL
========================================= */

const findUserByEmail =
  async (email) => {
    return User.findOne({
      email:
        email.toLowerCase(),
    }).select("+password");
  };

/* =========================================
   FIND USER BY PHONE
========================================= */

const findUserByPhone =
  async (
    fullPhoneNumber
  ) => {
    return User.findOne({
      fullPhoneNumber,
    }).select("+password");
  };

/* =========================================
   CREATE USER
========================================= */

const createUser =
  async (data) => {
    return User.create(data);
  };

/* =========================================
   UPDATE USER
========================================= */

const updateUser =
  async (
    userId,
    data
  ) => {
    return User.findByIdAndUpdate(
      userId,
      data,
      {
        new: true,

        runValidators: true,
      }
    ).select(
      "-password -refreshToken"
    );
  };

/* =========================================
   UPDATE USER AVATAR
========================================= */

const updateUserAvatar =
  async (
    userId,
    avatar
  ) => {
    return User.findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
      }
    ).select(
      "-password -refreshToken"
    );
  };

/* =========================================
   UPDATE LAST LOGIN
========================================= */

const updateLastLogin =
  async (userId) => {
    return User.findByIdAndUpdate(
      userId,
      {
        lastLogin:
          new Date(),
      },
      {
        new: true,
      }
    );
  };

/* =========================================
   DELETE USER
========================================= */

const deleteUserById =
  async (userId) => {
    return User.findByIdAndDelete(
      userId
    );
  };

module.exports = {
  findUserById,

  findUserWithPassword,

  findUserByEmail,

  findUserByPhone,

  createUser,

  updateUser,

  updateUserAvatar,

  updateLastLogin,

  deleteUserById,
};