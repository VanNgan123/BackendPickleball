const UserRouter = require('./UserRouter');
const ProductRouter =require('./ProductRouter')
const CategoryRouter =require('./CategoryRouter')
const CartRouter = require("./CartRouter");
const OrderRouter = require("./OrderRouter");
const ReviewRouter = require("./ReviewRouter");
const WishlistRouter = require("./WishlistRouter");
const CouponRouter = require("./CouponRouter");

const routes = (app) =>{
    app.use('/api/users',UserRouter);
    app.use('/api/products',ProductRouter)
    app.use('/api/category',CategoryRouter);
    app.use("/api/cart", CartRouter);
    app.use("/api/orders", OrderRouter);
    app.use("/api/reviews", ReviewRouter);
    app.use("/api/wishlist", WishlistRouter);
    app.use("/api/coupons", CouponRouter);
}

module.exports = routes;