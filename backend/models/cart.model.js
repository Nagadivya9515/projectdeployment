import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  img: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["product", "package"],
    required: [true, "Item type is required"],
  },
  qty: {
    type: Number,
    default: 1,
    min: [1, "Quantity cannot be less than 1"],
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });

export const Cart = mongoose.model("Cart", cartSchema);