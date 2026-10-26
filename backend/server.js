
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// ================= MIDDLEWARES =================

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || !process.env.MONGODB_URI) {
  throw new Error("JWT_SECRET or MONGODB_URI is missing from .env");
}

// ================= DATABASE CONNECTION =================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas Connected Successfully"))
  .catch((error) =>
    console.error("MongoDB Connection Error:", error.message)
  );

// ================= USER MODEL =================

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    age: Number,
    gender: String,
    course: String,
    time_slot: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// ================= ANNOUNCEMENT MODEL =================

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

// ================= AUTHENTICATION MIDDLEWARE =================

const auth = (req, res, next) => {
  const authorization = req.header("Authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid or expired",
    });
  }
};

// ================= ADMIN MIDDLEWARE =================

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
    console.error("Admin verification error:", error);

    return res.status(500).json({
      message: "Failed to verify admin",
    });
  }
};

// ================= AUTH ROUTES =================

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

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name: full_name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      age,
      gender,
      course,
      time_slot,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser._id.toString() },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return res.status(201).json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

// 2. Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

// ================= USER DASHBOARD ROUTES =================

// 3. Get Logged-in User Profile
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Server error fetching profile",
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
      {
        full_name,
        phone,
        age,
        gender,
        course,
        time_slot,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
});

// 5. Public Student List for Logged-in Users
app.get("/api/users/list", auth, async (req, res) => {
  try {
    const users = await User.find().select(
      "full_name course time_slot"
    );

    return res.json(users);
  } catch (error) {
    console.error("User list error:", error);

    return res.status(500).json({
      message: "Server error fetching user list",
    });
  }
});

// ================= ADMIN USER ROUTES =================

// 6. Get All Users
app.get("/api/admin/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Server error fetching all users",
    });
  }
});

// 7. Update User
app.put("/api/admin/users/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const {
      full_name,
      email,
      phone,
      age,
      gender,
      course,
      time_slot,
    } = req.body;

    // Do not allow role changes through this endpoint.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email:
          typeof email === "string"
            ? email.trim().toLowerCase()
            : email,
        phone,
        age,
        gender,
        course,
        time_slot,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      message: "Failed to update user",
    });
  }
});

// 8. Delete User
app.delete("/api/admin/users/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Prevent the logged-in admin from deleting their own account.
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

// ================= ANNOUNCEMENT ROUTES =================

// 9. Get Announcements (Logged-in users)
app.get("/api/announcements", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ announcements });
  } catch (error) {
    console.error("Fetch announcements error:", error);

    return res.status(500).json({
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
      const { title, message } = req.body;

      if (
        typeof title !== "string" ||
        typeof message !== "string" ||
        !title.trim() ||
        !message.trim()
      ) {
        return res.status(400).json({
          message: "Title and message are required",
        });
      }

      const announcement = await Announcement.create({
        title: title.trim(),
        message: message.trim(),
        createdBy: req.user.id,
      });

      return res.status(201).json({ announcement });
    } catch (error) {
      console.error("Create announcement error:", error);

      return res.status(500).json({
        message: "Failed to create announcement",
      });
    }
  }
);

// 11. Delete Announcement (Admin only)
app.delete(
  "/api/announcements/:id",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid announcement ID",
        });
      }

      const deletedAnnouncement =
        await Announcement.findByIdAndDelete(req.params.id);

      if (!deletedAnnouncement) {
        return res.status(404).json({
          message: "Announcement not found",
        });
      }

      return res.status(200).json({
        message: "Announcement deleted successfully",
      });
    } catch (error) {
      console.error("Delete announcement error:", error);

      return res.status(500).json({
        message: "Failed to delete announcement",
      });
    }
  }
);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.status(200).send("Easy Skill API is running");
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
