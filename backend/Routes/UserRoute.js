import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyEmail,
  enableDisable2FA,
  verify2FACode,
  createUserByAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/UserController";
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify-email", verifyEmail);

// Forgot Password - Public
userRouter.post("/forgot-password", forgotPassword);

// Reset Password - Public (uses token from URL/query)
userRouter.post("/reset-password", resetPassword);

// Protected Routes (Authentication required)
userRouter.use(authMiddleware);

// User Profile
userRouter.get("/me", getCurrentUser);

// 2FA Routes
userRouter.post("/2fa/toggle", enableDisable2FA);
userRouter.post("/2fa/verify", verify2FACode);

// Admin-only Routes
userRouter.post("/admin/users", roleMiddleware(["ADMIN"]), createUserByAdmin);

// CRUD Users (Admin or self)
userRouter.get("/users", roleMiddleware(["ADMIN"]), getAllUsers);
userRouter.get("/users/:id", roleMiddleware(["ADMIN"]), getUserById);
userRouter.put("/users/:id", roleMiddleware(["ADMIN"]), updateUser);
userRouter.delete("/users/:id", roleMiddleware(["ADMIN"]), deleteUser);

export default userRouter;
