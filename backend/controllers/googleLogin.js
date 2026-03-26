const axios = require("axios");
const jwt = require("jsonwebtoken");
const RegisterModel = require("../model/Register.model");

const googleLogin = async (req, res) => {
  try {

    const { access_token } = req.body;

    // Verify token with Google
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, picture } = googleRes.data;

    // Check if user exists
    let user = await RegisterModel.findOne({ email });

    if (!user) {
      user = await RegisterModel.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        role: "student",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google login success",
      token,
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Google auth failed" });
  }
};

module.exports = googleLogin;