import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!/^\+?[0-9]{9,15}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, phone, password });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password (no verification code) — allow user to reset by email
export const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // pre-save hook will hash
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    // If using cookie-based auth, clear cookie here
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get own profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user should be set by auth middleware; return dummy
    res.json({ message: "User profile", user: req.user || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update own profile
export const updateUserProfile = async (req, res) => {
  try {
    // TODO: Apply updates to DB
    res.json({ message: "Profile updated", updates: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all users
export const getUsers = async (req, res) => {
  try {
    // TODO: return users from DB
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: delete from DB
    res.json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get user by id
export const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: fetch user
    res.json({ id, name: "Demo User", email: "demo@example.com" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: perform update in DB
    res.json({ message: `User ${id} updated`, updates: req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
