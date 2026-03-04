import express from "express";
import {
  createPurchaseRequest,
  getPurchaseRequests,
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
export default router;
