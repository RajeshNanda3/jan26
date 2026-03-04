import { prisma } from "../config/prisma.js";
import trycatch from "../middlewares/trycatch.js";

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
