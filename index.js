const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require("./Routes/Products");
const categoriesRouter = require("./Routes/Category");
const brandsRouter = require("./Routes/Brand");
const usersRouter = require("./Routes/User");
const authRouter = require("./Routes/Auth");
const cartRouter = require("./Routes/Cart");
const orderRouter = require("./Routes/Order");
const cors = require("cors");

//middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); //to parse req.body
server.use("/products", productsRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/user", usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);
main().catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});
