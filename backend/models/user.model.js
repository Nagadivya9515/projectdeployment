import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["user", "admin", "manager"],
            default: "user",
        },
        // --- MISSING FIELDS ADDED BELOW ---
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Hash password before saving

userSchema.pre("save", async function () {

if (!this.isModified("password")) return;



this.password = await bcrypt.hash(this.password, 10);

// No need to call next() in an async function

});

export const User = mongoose.model("User", userSchema);