const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../Controller/Product");
const { Product } = require("../Models/Product");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct)
  .get("/update/test", async (req, res) => {
    const products = await Product.find({});
    for (let product of products) {
      product.discountedPrice = Math.round(
        product.price * (1 - product.discountPercentage / 100) * 83
      );
      await product.save();
      console.log(product.title + "updated");
    }
    res.send("ok");
  });

exports.router = router;
