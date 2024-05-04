const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  //TODO: we can make seperate schema for addresses.
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] },
  salt: Buffer,
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.mongoose.model("User", userSchema);
