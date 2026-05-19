const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        brand: { type: String },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        image: [{ type: String }],
        stock: { type: Number, default: 0 },
        specs: { type: Object },
    },
    { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ slug: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
