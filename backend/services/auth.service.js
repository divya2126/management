const RegisterModel = require("../model/Register.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerService = async (data) => {

  const { name, email, password, role } = data;

  // check if user exists
  const existingUser = await RegisterModel.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await RegisterModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // generate token
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
};
const loginService = async (data) => {

  const { email, password } = data;

  const user = await RegisterModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
};

module.exports = {
  registerService,
  loginService,
};