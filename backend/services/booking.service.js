import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { PackageType } from "../models/packagetype.model.js";
import { ApiError } from "../utils/ApiError.js";

export const processBooking = async (userId, bookingData) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Database Transaction (Fixes P5)

    try {
        const { mode, item, ...details } = bookingData;
        let items = [];

        if (mode === "direct") {
            const Model = item.type === "product" ? Product : PackageType;
            const dbItem = await Model.findById(item.itemId);
            if (!dbItem) throw new ApiError(404, "Item not found");

            items.push({
                itemId: dbItem._id,
                name: dbItem.name || dbItem.title,
                price: dbItem.price || dbItem.basePrice,
                qty: 1,
                type: item.type
            });
        } else if (mode === "cart") {
            const cart = await Cart.findOne({ user: userId });
            if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

            items = cart.items.map(i => ({ ...i.toObject() }));
            
            // Clear cart within the same transaction
            cart.items = [];
            await cart.save({ session });
        } else {
            throw new ApiError(400, "Invalid booking mode");
        }

        const totalAmount = items.reduce((sum, i) => sum + (i.price * i.qty), 0);

        const booking = await Booking.create([{
            user: userId,
            items,
            totalAmount,
            ...details,
            eventDate: details.eventDate ? new Date(details.eventDate) : null
        }], { session });

        await session.commitTransaction();
        return booking[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getUserBookings = async (userId) => {
    return await Booking.find({ user: userId }).sort({ createdAt: -1 });
};

export const updateStatus = async (id, status, user) => {
    if (!["confirmed", "cancelled"].includes(status)) throw new ApiError(400, "Invalid status");

    const booking = await Booking.findById(id);
    if (!booking) throw new ApiError(404, "Booking not found");

    // Auth Check (Fixes P4)
    const isAdmin = user.role === "manager" || user.role === "admin";
    const isOwner = booking.user.toString() === user.id.toString();
    
    if (!isAdmin && !isOwner) throw new ApiError(403, "Unauthorized to update this booking");

    booking.status = status;
    if (status === "confirmed") booking.paymentStatus = "paid";

    return await booking.save();
};