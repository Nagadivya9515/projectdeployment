import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as cartService from "../services/cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getOrCreateCart(req.user.id);
    res.status(200).json(new ApiResponse(200, cart, "Cart fetched"));
});

export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, type } = req.body;
    const cart = await cartService.addItemToCart(req.user.id, itemId, type);
    res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

export const updateCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { qty } = req.body;
    const cart = await cartService.updateItemQuantity(req.user.id, itemId, qty);
    res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearUserCart(req.user.id);
    res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});