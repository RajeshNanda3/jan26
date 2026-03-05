import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  createPurchaseRequest,
  getPurchaseRequests,
  getVendorProfile,
  upsertVendorProfile,
} from "../controllers/vendorController.js";
import { isAuth, authorizedVendor } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/create-purchase-request",
  isAuth,
  authorizedVendor,
  createPurchaseRequest,
);
router.get("/purchase-requests", isAuth, authorizedVendor, getPurchaseRequests);

// Vendor Profile endpoints
router.get("/profile", isAuth, authorizedVendor, getVendorProfile);
router.post(
  "/profile",
  isAuth,
  authorizedVendor,
  upload.single("avatar"),
  upsertVendorProfile,
);

export default router;
