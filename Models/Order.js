const mongoose = require("mongoose");
const { Schema } = mongoose;
const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for Payment Method`",
};
const orderSchema = new Schema(
  {
    products: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "pending" },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.mongoose.model("Order", orderSchema);
