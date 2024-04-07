const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  updateOrder,
} = require("../Controller/Order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/", fetchOrderByUser)
  .patch("/:id", updateOrder);

exports.router = router;
