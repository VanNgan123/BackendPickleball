const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true },
        phone: { type: String, trim: true },
        avatar: { type: String, default: null },
        role: {
            type: String,
            enum: ["customer", "admin", "manager", "support"],
            default: "customer",
        },
        address: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User",userSchema);
module.exports= User;
