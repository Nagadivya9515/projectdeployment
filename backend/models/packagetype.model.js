// models/packagetype.model.js
import mongoose from "mongoose";

const packageTypeSchema = new mongoose.Schema(
  {
    packageSlug: {
      type:     String,
      required: [true, "Package slug is required"],
      trim:     true,
    },
    name: {
      type:     String,
      required: [true, "Package type name is required"],
      trim:     true,
    },
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [0, "Price cannot be negative"],
    },
    services: {
      type:    [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PackageType = mongoose.model("PackageType", packageTypeSchema);