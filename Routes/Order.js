const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  updateOrder,
  fetchAllOrders,
  deleteOrder,
} = require("../Controller/Order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/own/", fetchOrderByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

exports.router = router;
