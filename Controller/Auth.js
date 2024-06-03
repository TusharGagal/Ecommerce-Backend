const { User } = require("../Models/User");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../Services/Common");
var jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt: salt,
        });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(200)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};
exports.logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};
exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();
    const resetPageLink =
      "http://cartease-tushargagals-projects.vercel.app/reset-password?token=" +
      token +
      "&email=" +
      email;
    const subject = "Reset password request for CartEase Account";
    const html = `<p>Click <a href=${resetPageLink}>here</a> to reset your password</p>`;
    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};
exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    try {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          user.password = hashedPassword;
          user.salt = salt;
          await user.save();
          const subject = "Password Successfully reset for CartEase Account";
          const html = `<p>You have successfully reset your password.</p>`;
          if (email) {
            const response = await sendMail({ to: email, subject, html });
            res.json(response);
          } else {
            res.sendStatus(401);
          }
        }
      );
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.sendStatus(401);
  }
};
