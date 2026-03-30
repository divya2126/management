const { loginService } = require("../services/auth.service");
const userLogin = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = userLogin;
