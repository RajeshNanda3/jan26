import { prisma } from "../config/prisma.js";
import trycatch from "../middlewares/trycatch.js";
import cloudinary from "../services/cloudinaryService.js";
import fs from "fs";

export const createPurchaseRequest = async (req, res) => {
  try {
    const { points } = req.body;
    const vendorId = req.user.id;

    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });
    // console.log(vendor.name)

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }
    const numbPoints = parseInt(points, 10);
    const request = await prisma.purchaseRequest.create({
      data: {
        vendor_id: vendorId,
        points: numbPoints,
        status: "PENDING",
      },
    });
    res.json({ message: "Purchase request created", request });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const getPurchaseRequests = trycatch(async (req, res) => {
  const vendorId = req.user.id;
  const requests = await prisma.purchaseRequest.findMany({
    where: { vendor_id: vendorId },
    orderBy: { created_at: "desc" },
  });
  res.status(200).json({
    message: "Purchase requests fetched successfully",
    requests,
  });
});

/* ===================== VENDOR PROFILE ENDPOINTS ===================== */

export const getVendorProfile = trycatch(async (req, res) => {
  const vendorId = req.user.id;
  console.log("hii deepak", vendorId)

  const profile = await prisma.vendorProfile.findUnique({
    where: { vendor_id: vendorId },
  });

  if (!profile) {
    return res.status(404).json({ message: "Vendor profile not found here" });
  }

  res.status(200).json({
    message: "Vendor profile fetched successfully",
    profile,
  });
});

export const upsertVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const {
      store_name,
      category,
      market_name,
      deals_with,
      address_at,
      address_po,
      address_market,
      address_dist,
      address_pin,
    } = req.body || {};

    // Parse deals_with if it's a string
    let dealsWithArray = [];
    if (deals_with) {
      if (typeof deals_with === "string") {
        dealsWithArray = deals_with
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(deals_with)) {
        dealsWithArray = deals_with;
      }
    }

    // Prepare data object
    const data = {
      store_name: store_name || null,
      category: category || null,
      market_name: market_name || null,
      deals_with: dealsWithArray,
      address_at: address_at || null,
      address_po: address_po || null,
      address_market: address_market || null,
      address_dist: address_dist || null,
      address_pin: address_pin || null,
    };

    // If image uploaded
    if (req.file) {
      const filePath = req.file.path;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "vendor_profiles",
        public_id: `vendor_${vendorId}_${Date.now()}`,
        overwrite: true,
      });

      // Save image URL
      data.avatar = result.secure_url;

      // Delete temp file
      fs.unlinkSync(filePath);
    }

    // Upsert vendor profile
    const profile = await prisma.vendorProfile.upsert({
      where: { vendor_id: vendorId },
      update: data,
      create: {
        vendor_id: vendorId,
        store_name: store_name || "Store",
        ...data,
      },
    });

    res.status(200).json({
      message: "Vendor profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Vendor profile error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
