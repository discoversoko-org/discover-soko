require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    const res = await User.updateMany(
      {
        $or: [
          { phoneVerified: { $exists: true } },
          { phoneVerifiedAt: { $exists: true } },
        ],
      },
      {
        $unset: {
          phoneVerified: "",
          phoneVerifiedAt: "",
        },
      }
    );

    console.log(
      JSON.stringify({
        matchedCount: res.matchedCount,
        modifiedCount: res.modifiedCount,
      })
    );

    const remaining = await User.findOne({
      $or: [{ phoneVerified: { $exists: true } }, { phoneVerifiedAt: { $exists: true } }],
    }).select("_id");

    console.log(JSON.stringify({ remaining: !!remaining }));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
