import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  verifyOtp,
  myProfile,
  refreshToken,
  logoutUser,
  refreshCSRF,
  adminController,
  getAllVendors,
  updateProfile,
} from "../controllers/userController.js";
import { is } from "zod/v4/locales";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";
import { verifyCSRFToken } from "../config/csrfMiddleware.js";

const router = express.Router();
// Sample route for user registration
router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/me", isAuth, myProfile);
router.put("/update-profile", isAuth, updateProfile);
router.get("/vendors", getAllVendors);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);
// router.get('/profile/:userId', getUserProfile);

// router.get('/admin', isAuth, authorizedAdmin, adminController)

export default router;
