const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/user");

router.use(authMiddleware);

// CREATE OR GET USER
router.post("/sync", async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    let user = await User.findOne({
      firebaseUid: firebaseUser.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.name || "User",
        email: firebaseUser.email,
        photoURL: firebaseUser.picture || "",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
});

// GET PROFILE
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
});

module.exports = router;