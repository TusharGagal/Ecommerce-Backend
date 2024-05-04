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
var jwt = require("jsonwebtoken");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./Models/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const { sanitizeUser, isAuth, cookieExtractor } = require("./Services/Common");

const SECRET_KEY = "SECRET_KEY";

//jwt options
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; //TODO: should not be in code.

//middlewares
server.use(express.static("build"));
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); //to parse req.body
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/user", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);

//Passport strategy
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();
      //this is temporary we will use strong password auth.
      if (!user) {
        done(null, false, { message: "Invalid Credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, false, { message: "Invalid Credentials" });
          } else {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            done(null, { id: user.id, role: user.role });
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });

    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      if (err) {
        return done(err, false);
      }
    }
  })
);

// this creates session variable req.user  on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize:", user);
  process.nextTick(function () {
    return cb(null, sanitizeUser(user));
  });
});

// this changes session variable req.user  on being called from authorized requests
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize:", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

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
