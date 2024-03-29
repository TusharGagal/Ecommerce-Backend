const { Product } = require("../Models/Product");

exports.createProduct = async (req, res) => {
  //this product we have to get from API body.
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchAllProducts = async (req, res) => {
  //we need all query strings.
  // filter={"category":"[smartphone","laptops"]}
  //sort={_sort:"price",_order:"desc"};
  //Pagination={_page:1,_limit=10}
  //TODO: we have to try the multiple catergories,brand in filter

  let query = Product.find({});
  let totalProductsQuery = Product.find({});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO: get sorting from discounted price not on actual price

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProductsQuery = totalProductsQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
    totalProductsQuery = totalProductsQuery
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  }

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
