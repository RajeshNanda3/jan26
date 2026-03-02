import express from "express";
import {
  purchasePointsHandler,
  issuePointsHandler,
  redeemPointsHandler,
  transferPointsHandler
} from "../controllers/transactionController.js";
import { isAuth, authorizedVendor } from "../middlewares/isAuth.js";

const router = express.Router();



//  Vendor purchases points
router.post("/purchase", purchasePointsHandler);

//  Vendor issues points to customer
router.post("/issue",isAuth, authorizedVendor, issuePointsHandler);

//  Customer redeems points at vendor

router.post("/redeem",isAuth, redeemPointsHandler);

//  Vendor to vendor transfer
router.post("/transfer", transferPointsHandler);

export default router;
