const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 2️⃣ Bearer token format
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4️⃣ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;