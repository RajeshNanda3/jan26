import express from "express";
import {createPurchaseRequest} from "../controllers/vendorController.js"
import { isAuth, authorizedVendor } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/create-purchase-request", isAuth, authorizedVendor, createPurchaseRequest);
export default router;