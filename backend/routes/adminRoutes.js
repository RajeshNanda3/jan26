import express from "express";
import { approvePurchaseRequestHandler, rejectPurchaseRequestHandler } from "../controllers/adminController.js";
import { isAuth, authorizedAdmin } from "../middlewares/isAuth.js";
const router = express.Router();

router.post("/approve-purchase-request", isAuth, authorizedAdmin, approvePurchaseRequestHandler);
router.post("/reject-purchase-request", isAuth, authorizedAdmin, rejectPurchaseRequestHandler);
export default router;