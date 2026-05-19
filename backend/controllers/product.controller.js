import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as productService from "../services/product.service.js";

export const getProducts = asyncHandler(async (req, res) => {
  const data = await productService.getAllProducts();
  res.status(200).json(new ApiResponse(200, data, "Products fetched"));
});

export const addProduct = asyncHandler(async (req, res) => {
  const data = await productService.createProduct(req.body);
  res.status(201).json(new ApiResponse(201, data, "Product created"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, data, "Product updated"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const data = await productService.deleteProduct(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Product deleted"));
});