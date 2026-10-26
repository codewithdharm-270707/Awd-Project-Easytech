
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

// --- MONGODB CONNECTION ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- USER SCHEMA & MODEL ---
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String },
  course: { type: String },
  time_slot: { type: String },
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

// --- ANNOUNCEMENT MODEL ---
const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

// --- AUTHENTICATION MIDDLEWARE ---
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token is invalid or expired",
    });
  }
};

// --- ADMIN MIDDLEWARE ---
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Admin rights required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Failed to verify admin",
    });
  }
};

// --- AUTH ROUTES ---

// 1. Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      age,
      gender,
      course,
      time_slot,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      course,
      time_slot,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// 2. Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// --- USER DASHBOARD ROUTES ---

// 3. Get Logged-in User Profile
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// 4. Update Logged-in User Profile
app.put("/api/user/profile", auth, async (req, res) => {
  try {
    const {
      full_name,
      phone,
      age,
      gender,
      course,
      time_slot,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { full_name, phone, age, gender, course, time_slot },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// 5. Public Student List for Logged-in Users
app.get("/api/users/list", auth, async (req, res) => {
  try {
    const users = await User.find().select(
      "full_name course time_slot"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching user list",
    });
  }
});

// --- ADMIN ROUTES ---

// 6. Get All Users
app.get("/api/admin/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching all users",
    });
  }
});

// 7. Update User
app.put("/api/admin/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      age,
      gender,
      course,
      time_slot,
      role,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email,
        phone,
        age,
        gender,
        course,
        time_slot,
        role,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// 8. Delete User
app.delete("/api/admin/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

// --- ANNOUNCEMENT ROUTES ---

// 9. Get Announcements (All logged-in users)
app.get("/api/announcements", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ announcements });
  } catch (error) {
    console.error("Fetch announcements error:", error);

    res.status(500).json({
      message: "Failed to load announcements",
    });
  }
});

// 10. Publish Announcement (Admin only)
app.post(
  "/api/announcements",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const title = req.body.title?.trim();
      const message = req.body.message?.trim();

      if (!title || !message) {
        return res.status(400).json({
          message: "Title and message are required",
        });
      }

      const announcement = await Announcement.create({
        title,
        message,
        createdBy: req.user.id,
      });

      res.status(201).json({ announcement });
    } catch (error) {
      console.error("Create announcement error:", error);

      res.status(500).json({
        message: "Failed to create announcement",
      });
    }
  }
);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
