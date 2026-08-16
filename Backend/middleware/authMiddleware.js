// middleware/authMiddleware.js
const admin = require("../config/firebase");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }

    const token = authHeader.split("Bearer ")[1];

    // ✅ Check if Firebase Admin is initialized
    if (admin.apps && admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        req.firebaseUser = decodedToken;
        
        // ✅ Get or create user in MongoDB
        let dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!dbUser) {
          // Create user if doesn't exist
          dbUser = await User.create({
            firebaseUid: decodedToken.uid,
            name: decodedToken.name || "User",
            email: decodedToken.email,
            photoURL: decodedToken.picture || "",
          });
        }
        req.dbUser = dbUser;
        
        next();
      } catch (firebaseError) {
        console.error("Firebase verification error:", firebaseError.message);
        
        // ✅ In development, allow mock token for testing
        if (process.env.NODE_ENV === "development") {
          console.warn("⚠️ Using mock user for development");
          req.user = { uid: "mock-uid", email: "dev@jmorganic.in", name: "Dev User" };
          req.firebaseUser = req.user;
          
          let dbUser = await User.findOne({ firebaseUid: "mock-uid" });
          if (!dbUser) {
            dbUser = await User.create({
              firebaseUid: "mock-uid",
              name: "Dev User",
              email: "dev@jmorganic.in",
            });
          }
          req.dbUser = dbUser;
          return next();
        }
        
        return res.status(401).json({
          success: false,
          message: "Invalid Firebase token"
        });
      }
    } else {
      // ✅ Fallback for development
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Firebase Admin not initialized. Using mock user.");
        req.user = { uid: "mock-uid", email: "dev@jmorganic.in", name: "Dev User" };
        req.firebaseUser = req.user;
        
        let dbUser = await User.findOne({ firebaseUid: "mock-uid" });
        if (!dbUser) {
          dbUser = await User.create({
            firebaseUid: "mock-uid",
            name: "Dev User",
            email: "dev@jmorganic.in",
          });
        }
        req.dbUser = dbUser;
        next();
      } else {
        return res.status(500).json({
          success: false,
          message: "Authentication service not configured"
        });
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid authentication token"
    });
  }
};

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = req.dbUser || await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authorization error"
    });
  }
};

module.exports = { verifyToken, isAdmin };