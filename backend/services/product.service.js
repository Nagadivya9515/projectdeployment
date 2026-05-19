import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllProducts = async () => {
  return await Product.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createProduct = async (productData) => {
  const existing = await Product.findOne({ slug: productData.slug });
  if (existing) throw new ApiError(409, "Product slug already exists");
  
  return await Product.create(productData);
};

export const updateProduct = async (id, updateData) => {
  const updated = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new ApiError(404, "Product not found");
  return updated;
};

export const deleteProduct = async (id) => {
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Product not found");
  return { deletedId: id };
};