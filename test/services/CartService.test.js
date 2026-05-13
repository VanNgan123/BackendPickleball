const CartService = require("../../src/services/CartService");
const Cart = require("../../src/models/Cart");
const Product = require("../../src/models/Product");

describe("CartService", () => {
  let testProduct;
  const testUserId = "507f1f77bcf86cd799439011";

  beforeEach(async () => {
    await Cart.deleteMany({});
    await Product.deleteMany({});

    testProduct = await Product.create({
      name: "Test Product",
      price: 100,
      slug: "test-product",
      stock: 50,
    });
  });

  describe("addToCart", () => {
    it("should add product to cart successfully when cart does not exist", async () => {
      const result = await CartService.addToCart(testUserId, testProduct._id, 1);

      expect(result.userId.toString()).toBe(testUserId);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].qty).toBe(1);
      expect(result.items[0].productId.name).toBe("Test Product");
    });

    it("should add product to existing cart", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const anotherProduct = await Product.create({
        name: "Another Product",
        price: 200,
        slug: "another-product",
        stock: 30,
      });

      const result = await CartService.addToCart(testUserId, anotherProduct._id, 2);

      expect(result.items).toHaveLength(2);
    });

    it("should increase quantity if product already exists in cart", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const result = await CartService.addToCart(testUserId, testProduct._id, 2);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].qty).toBe(3);
    });

    it("should throw error if product does not exist", async () => {
      const nonExistentProductId = "507f1f77bcf86cd799439012";

      await expect(
        CartService.addToCart(testUserId, nonExistentProductId, 1)
      ).rejects.toThrow("Không tìm thấy sản phẩm.");
    });
  });

  describe("getCartByUser", () => {
    it("should get cart by user id", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 2 }],
      });

      const result = await CartService.getCartByUser(testUserId);

      expect(result.userId.toString()).toBe(testUserId);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].qty).toBe(2);
    });

    it("should return empty cart if user has no cart", async () => {
      const result = await CartService.getCartByUser(testUserId);

      expect(result.userId).toBe(testUserId);
      expect(result.items).toEqual([]);
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity successfully", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const result = await CartService.updateCartItem(testUserId, testProduct._id, 5);

      expect(result.items[0].qty).toBe(5);
    });

    it("should remove item if quantity is 0 or less", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const result = await CartService.updateCartItem(testUserId, testProduct._id, 0);

      expect(result.items).toHaveLength(0);
    });

    it("should throw error if cart does not exist", async () => {
      await expect(
        CartService.updateCartItem(testUserId, testProduct._id, 2)
      ).rejects.toThrow("Không tìm thấy giỏ hàng.");
    });

    it("should throw error if product not in cart", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const nonExistentProductId = "507f1f77bcf86cd799439012";

      await expect(
        CartService.updateCartItem(testUserId, nonExistentProductId, 2)
      ).rejects.toThrow("Sản phẩm không tồn tại trong giỏ.");
    });
  });

  describe("removeFromCart", () => {
    it("should remove product from cart", async () => {
      await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 1 }],
      });

      const result = await CartService.removeFromCart(testUserId, testProduct._id);

      expect(result.items).toHaveLength(0);
    });

    it("should throw error if cart does not exist", async () => {
      await expect(
        CartService.removeFromCart(testUserId, testProduct._id)
      ).rejects.toThrow("Không tìm thấy giỏ hàng.");
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", async () => {
      const cart = await Cart.create({
        userId: testUserId,
        items: [{ productId: testProduct._id, qty: 2 }],
      });

      const result = await CartService.clearCart(testUserId);

      expect(result._id).toEqual(cart._id);

      const deletedCart = await Cart.findById(cart._id);
      expect(deletedCart).toBeNull();
    });
  });
});
