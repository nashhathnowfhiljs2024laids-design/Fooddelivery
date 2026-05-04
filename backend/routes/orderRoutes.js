import express from "express";
import Order from "../models/Order.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// PLACE ORDER (Customer only)
router.post("/", authenticate, authorize(['customer']), async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Order Placed Successfully" });
});

// GET ALL ORDERS (Restaurant/Admin)
router.get("/", authenticate, authorize(['restaurant']), async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
});

// UPDATE STATUS (Restaurant)
router.put("/:id", authenticate, authorize(['restaurant']), async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.json({ message: "Status Updated" });
});

export default router;
