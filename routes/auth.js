const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json("Thiếu username hoặc password");
    }

    if (username.length < 3) {
      return res.status(400).json("Username phải ít nhất 3 ký tự");
    }

    if (password.length < 6) {
      return res.status(400).json("Password phải ít nhất 6 ký tự");
    }

    // 2. Check trùng username
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json("Username đã tồn tại");
    }

    // 3. Hash password
    const hash = await bcrypt.hash(password, 10);

    // 4. Tạo user
    const user = new User({ username, password: hash, role: "user" });
    await user.save();

    res.json("Đăng ký thành công");
  } catch (err) {
    console.error(err);
    res.status(500).json("Lỗi server");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Thiếu username hoặc password");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("User không tồn tại");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json("Sai mật khẩu");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token hết hạn sau 1 ngày
    );

    res.json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Lỗi server");
  }
});

module.exports = router;