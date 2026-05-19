// models/package.model.js
import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Package name is required"],
      trim:     true,
    },
    slug: {
      type:     String,
      required: [true, "Slug is required"],
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type:    Boolean,
      default: true,       // soft visibility toggle
    },
  },
  { timestamps: true }     // adds createdAt, updatedAt automatically
);

export const Package = mongoose.model("Package", packageSchema);