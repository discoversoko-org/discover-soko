const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

/* 📌 REGISTER */
const register = async ({ name, email, password, filePath }) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw { status: 400, message: "User already exists with this email" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    name,
    email,
    password: hashedPassword,
    role: "user",
  };

  if (filePath) {
    userData.avatar = { url: filePath };
  }

  const user = await userRepository.createUser(userData);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ✅ RETURN RAW
  return { user, token };
};

/* 📌 LOGIN */
const login = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ✅ RETURN RAW
  return { user, token };
};

module.exports = {
  register,
  login,
};