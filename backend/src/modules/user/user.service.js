const cloudinary = require(
  "../../infrastructure/storage/cloudinary"
);

const userRepository = require(
  "./user.repository"
);

const {
  hashPassword,
  comparePassword,
} = require(
  "../auth/password.service"
);

/* =========================================
   GET PROFILE
========================================= */

const getProfile =
  async (userId) => {
    const user =
      await userRepository.findUserById(
        userId
      );

    if (!user) {
      throw {
        status: 404,

        message:
          "User not found",
      };
    }

    return user;
  };

/* =========================================
   UPDATE PROFILE
========================================= */

const updateProfile =
  async ({
    userId,
    data,
    file,
  }) => {
    const user =
      await userRepository.findUserById(
        userId
      );

    if (!user) {
      throw {
        status: 404,

        message:
          "User not found",
      };
    }

    const updateData = {};

    /* =========================
       NAME
    ========================= */

    if (data.name) {
      updateData.name =
        data.name.trim();
    }

    /* =========================
       PHONE
    ========================= */

    if (
      data.countryCode &&
      data.phoneNumber
    ) {
      updateData.countryCode =
        data.countryCode;

      updateData.phoneNumber =
        data.phoneNumber;

      updateData.fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
    }

    /* =========================
       AVATAR
    ========================= */

    if (file) {
      if (
        user.avatar
          ?.public_id
      ) {
        try {
          await cloudinary.uploader.destroy(
            user.avatar
              .public_id
          );
        } catch (error) {
          console.error(
            "Avatar deletion failed:",
            error.message
          );
        }
      }

      const uploadedImage =
        await cloudinary.uploader.upload(
          file.path,
          {
            folder:
              "users/avatars",
          }
        );

      updateData.avatar = {
        url:
          uploadedImage.secure_url,

        public_id:
          uploadedImage.public_id,
      };
    }

    const updatedUser =
      await userRepository.updateUser(
        userId,
        updateData
      );

    return updatedUser;
  };

/* =========================================
   CHANGE PASSWORD
========================================= */

const changePassword =
  async ({
    userId,
    currentPassword,
    newPassword,
  }) => {
    const user =
      await userRepository.findUserWithPassword(
        userId
      );

    if (!user) {
      throw {
        status: 404,

        message:
          "User not found",
      };
    }

    const isPasswordCorrect =
      await comparePassword(
        {
          password:
            currentPassword,

          hashedPassword:
            user.password,
        }
      );

    if (
      !isPasswordCorrect
    ) {
      throw {
        status: 400,

        message:
          "Current password is incorrect",
      };
    }

    const hashedPassword =
      await hashPassword(
        newPassword
      );

    await userRepository.updateUser(
      userId,
      {
        password:
          hashedPassword,
      }
    );

    return {
      success: true,

      message:
        "Password changed successfully",
    };
  };

/* =========================================
   DELETE ACCOUNT
========================================= */

const deleteAccount =
  async (userId) => {
    const user =
      await userRepository.findUserById(
        userId
      );

    if (!user) {
      throw {
        status: 404,

        message:
          "User not found",
      };
    }

    if (
      user.avatar
        ?.public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          user.avatar
            .public_id
        );
      } catch (error) {
        console.error(
          "Cloudinary cleanup failed:",
          error.message
        );
      }
    }

    await userRepository.deleteUserById(
      userId
    );

    return {
      success: true,

      message:
        "Account deleted successfully",
    };
  };

module.exports = {
  getProfile,

  updateProfile,

  changePassword,

  deleteAccount,
};