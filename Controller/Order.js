const { Order } = require("../Models/Order");

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    // const result = await doc.populate("product");
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchOrderByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const orderItems = await Order.find({ user: user });
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.query;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
