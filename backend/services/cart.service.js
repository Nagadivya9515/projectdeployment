import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { PackageType } from "../models/packagetype.model.js";
import { ApiError } from "../utils/ApiError.js";

// Helper: Normalize item fields (Fixes P2 in your audit)
const resolveItemData = (itemData) => ({
    name: itemData.name || itemData.title,
    price: itemData.price || itemData.basePrice,
    img: itemData.image || itemData.img
});

export const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

export const addItemToCart = async (userId, itemId, type) => {
    if (!["product", "package"].includes(type)) {
        throw new ApiError(400, "Invalid type. Use 'product' or 'package'");
    }

    const Model = type === "product" ? Product : PackageType;
    const itemData = await Model.findById(itemId);
    if (!itemData) throw new ApiError(404, "Item not found");

    const { name, price, img } = resolveItemData(itemData);
    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find(i => i.itemId.equals(itemId) && i.type === type);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.items.push({ itemId, type, name, price, img, qty: 1 });
    }

    return await cart.save(); // Saved only ONCE (Fixes P1)
};

export const updateItemQuantity = async (userId, itemId, qty) => {
    const newQty = parseInt(qty);
    if (isNaN(newQty)) throw new ApiError(400, "Invalid quantity");

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.items.findIndex(i => i.itemId.toString() === itemId);
    if (itemIndex === -1) throw new ApiError(404, "Item not in cart");

    if (newQty <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].qty = newQty;
    }

    return await cart.save();
};

export const clearUserCart = async (userId) => {
    return await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });
};