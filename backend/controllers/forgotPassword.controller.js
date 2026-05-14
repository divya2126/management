const RegisterModel = require("../model/Register.model");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/email.service");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await RegisterModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: "If an account exists, a reset link has been sent to the email." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token to save in DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiry (15 minutes)
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Create reset url (Frontend URL)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(user.name, user.email, resetUrl);
      res.status(200).json({ message: "If an account exists, a reset link has been sent to the email." });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error("Email could not be sent", error);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = forgotPassword;
