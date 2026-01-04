// backend/controllers/userController.js

// Login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tạm thời test cho chạy (sau này nối DB)
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    res.json({
      message: "Login successful",
      email: email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    res.json({
      message: "Register successful",
      name,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
