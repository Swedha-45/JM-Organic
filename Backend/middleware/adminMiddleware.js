const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminMiddleware;