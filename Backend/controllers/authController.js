const admin = require('../config/firebase');
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ DEBUG: Log the user object
    console.log('🔍 User found in DB:', {
      id: user._id,
      email: user.email,
      role: user.role,  // This should be "admin"
      name: user.name
    });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    // ✅ DEBUG: Log what we're sending back
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address
    };
    console.log('📤 Sending user response:', userResponse);

    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
// @desc    Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, firstName, lastName, phone, address, city, state } = req.body;

    if (name) {
      user.name = name;
    } else if (firstName || lastName) {
      user.name = `${firstName || ''} ${lastName || ''}`.trim();
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address || city || state) {
      if (typeof address === 'object' && address !== null) {
        user.address = { ...(user.address || {}), ...address };
      } else {
        user.address = user.address || {};
        if (city !== undefined) user.address.city = city;
        if (state !== undefined) user.address.state = state;
        if (typeof address === 'string') user.address.street = address;
      }
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};



// ✅ Google OAuth Login/Register
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token required'
      });
    }

    // 1️⃣ Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // 2️⃣ Extract user data from Firebase
    const { 
      uid: firebaseUid, 
      name, 
      email, 
      picture: profilePicture,
      email_verified
    } = decodedToken;

    // 3️⃣ Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // 4️⃣ Check if user exists by email (if they registered with email/password before)
      user = await User.findOne({ email });
      
      if (user) {
        // User exists with email/password - link Google account
        user.firebaseUid = firebaseUid;
        user.authProvider = 'google';
        user.profilePicture = profilePicture || user.profilePicture;
        user.isEmailVerified = email_verified || false;
        await user.save();
      } else {
        // 5️⃣ Create NEW user in MongoDB
        user = await User.create({
          firebaseUid: firebaseUid,
          name: name || 'Google User',
          email: email,
          profilePicture: profilePicture || '',
          authProvider: 'google',
          isEmailVerified: email_verified || false,
          role: 'user', // Default role
          password: 'google_' + Math.random().toString(36).slice(-10) // Random password
        });
        console.log('✅ New Google user created in MongoDB:', user.email);
      }
    }

    // 6️⃣ Generate your JWT token for session
    const token = generateToken(user._id);

    // 7️⃣ Return user data + token
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

module.exports = {
    googleAuth,
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};