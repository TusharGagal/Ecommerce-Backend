const { User } = require("../Models/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    //this is temporary we will use strong password auth.
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
    } else if (user.password === req.body.password) {
      res
        .status(200)
        .json({
          id: user.id,
          email: user.email,
          name: user.name,
          addresses: user.addresses,
        });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
