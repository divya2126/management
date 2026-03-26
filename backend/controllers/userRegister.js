const { registerService } = require("../services/auth.service");

const userRegister = async (req, res) => {
  try {

    const result = await registerService(req.body);

    res.status(201).json({
      message: "Registration successful",
      user: result.user,
      token: result.token,
    });

  } catch (error) {

    res.status(400).json({
      message: error.message,
    });

  }
};

module.exports = userRegister;