const CouponServices = require("../../src/services/CouponServices");
const Coupon = require("../../src/models/Coupon");

describe("CouponServices", () => {
  beforeEach(async () => {
    await Coupon.deleteMany({});
  });

  describe("createCoupon", () => {
    it("should create a coupon successfully", async () => {
      const data = {
        code: "SUMMER20",
        discountType: "percentage",
        discountValue: 20,
        maxUses: 100,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 86400000),
      };

      const result = await CouponServices.createCoupon(data);

      expect(result.code).toBe("SUMMER20");
      expect(result.discountValue).toBe(20);
    });

    it("should throw error if coupon code already exists", async () => {
      await Coupon.create({
        code: "SUMMER20",
        discountType: "percentage",
        discountValue: 20,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 86400000),
      });

      await expect(
        CouponServices.createCoupon({
          code: "SUMMER20",
          discountType: "percentage",
          discountValue: 15,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 86400000),
        })
      ).rejects.toThrow();
    });
  });

  describe("getCouponByCode", () => {
    it("should get coupon by code", async () => {
      await Coupon.create({
        code: "SUMMER20",
        discountType: "percentage",
        discountValue: 20,
        isActive: true,
        maxUses: 100,
        usedCount: 0,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 86400000),
      });

      const result = await CouponServices.getCouponByCode("SUMMER20");

      expect(result.code).toBe("SUMMER20");
      expect(result.discountValue).toBe(20);
    });

    it("should throw error if coupon not found", async () => {
      await expect(
        CouponServices.getCouponByCode("NOTEXIST")
      ).rejects.toThrow();
    });

    it("should throw error if coupon is not active", async () => {
      await Coupon.create({
        code: "INACTIVE",
        discountType: "percentage",
        discountValue: 20,
        isActive: false,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 86400000),
      });

      await expect(
        CouponServices.getCouponByCode("INACTIVE")
      ).rejects.toThrow();
    });
  });

  describe("validateCoupon", () => {
    it("should validate coupon successfully", async () => {
      const validFrom = new Date(Date.now() - 86400000);
      const validTo = new Date(Date.now() + 86400000);
      await Coupon.create({
        code: "VALID",
        discountType: "percentage",
        discountValue: 20,
        isActive: true,
        maxUses: 100,
        usedCount: 0,
        validFrom,
        validTo,
      });

      const result = await CouponServices.validateCoupon("VALID", 100);

      expect(result.code).toBe("VALID");
    });

    it("should throw error if coupon is expired", async () => {
      const validFrom = new Date(Date.now() - 172800000);
      const validTo = new Date(Date.now() - 86400000);
      await Coupon.create({
        code: "EXPIRED",
        discountType: "percentage",
        discountValue: 20,
        isActive: true,
        validFrom,
        validTo,
      });

      await expect(
        CouponServices.validateCoupon("EXPIRED", 100)
      ).rejects.toThrow();
    });

    it("should throw error if coupon max uses reached", async () => {
      await Coupon.create({
        code: "MAXUSED",
        discountType: "percentage",
        discountValue: 20,
        isActive: true,
        usageLimit: 5,
        usedCount: 5,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 86400000),
      });

      await expect(
        CouponServices.validateCoupon("MAXUSED", 100)
      ).rejects.toThrow();
    });
  });

  describe("getAllCoupons", () => {
    it("should get all coupons", async () => {
      await Coupon.create([
        {
          code: "COUPON1",
          discountType: "percentage",
          discountValue: 10,
          isActive: true,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 86400000),
        },
        {
          code: "COUPON2",
          discountType: "fixed",
          discountValue: 5,
          isActive: false,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 86400000),
        },
      ]);

      const result = await CouponServices.getAllCoupons();

      expect(result).toHaveLength(2);
    });
  });
});
