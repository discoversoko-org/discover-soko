const cloudinary = require("../../config/cloudinary");
const userRepository = require("../repositories/user.repository");

/* 📌 UPDATE PROFILE */
const updateProfile = async ({ userId, data, file }) => {

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  const updateData = {
    name: data.name || user.name,
  };

  /* =========================
     HANDLE AVATAR
  ========================= */
  if (file) {

    console.log(" OLD AVATAR DATA:", user.avatar);

    // ✅ delete previous avatar (ONLY if valid public_id exists)
    if (user.avatar && user.avatar.public_id) {
      try {
        const deleteResult = await cloudinary.uploader.destroy(
          user.avatar.public_id
        );

        console.log(" CLOUDINARY DELETE RESULT:", deleteResult);

        if (deleteResult.result !== "ok") {
          console.warn(
            " Cloudinary did not delete image properly:",
            deleteResult
          );
        }

      } catch (err) {
        console.error(" Cloudinary delete error:", err);
      }
    } else {
      console.log(" No previous avatar public_id found, skipping delete");
    }

    // ✅ upload new avatar
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profiles",
    });

    console.log(" NEW AVATAR UPLOADED:", result.public_id);

    // ✅ save BOTH url + public_id
    updateData.avatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const updatedUser = await userRepository.updateUser(
    userId,
    updateData
  );

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
  };
};

module.exports = {
  updateProfile,
};