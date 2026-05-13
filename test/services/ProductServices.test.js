const ProductServices = require("../../src/services/ProductServices");
const Product = require("../../src/models/Product");
const Category = require("../../src/models/Category");

describe("ProductServices", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const data = {
        name: "Test Product",
        price: 100,
        stock: 50,
        brand: "TestBrand",
      };

      const result = await ProductServices.createProduct(data, []);

      expect(result.name).toBe("Test Product");
      expect(result.price).toBe(100);
      expect(result.stock).toBe(50);
      expect(result.slug).toBe("test-product");
      expect(result.brand).toBe("TestBrand");
    });

    it("should throw error if name or price is missing", async () => {
      const data = {
        name: "Test Product",
        // price is missing
        stock: 50,
      };

      await expect(
        ProductServices.createProduct(data, [])
      ).rejects.toThrow("Name or price is required");
    });

    it("should throw error if product already exists", async () => {
      const data = {
        name: "Test Product",
        price: 100,
        stock: 50,
      };

      await ProductServices.createProduct(data, []);

      await expect(
        ProductServices.createProduct(data, [])
      ).rejects.toThrow("Product already exists");
    });

    it("should create product with categories", async () => {
      const category = await Category.create({
        name: "Test Category",
        slug: "test-category",
      });

      const data = {
        name: "Test Product",
        price: 100,
        categories: [category._id.toString()],
        stock: 50,
      };

      const result = await ProductServices.createProduct(data, []);

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].toString()).toBe(category._id.toString());
    });

    it("should throw error if invalid category id", async () => {
      const data = {
        name: "Test Product",
        price: 100,
        categories: ["507f1f77bcf86cd799439011"],
        stock: 50,
      };

      await expect(
        ProductServices.createProduct(data, [])
      ).rejects.toThrow("Some category IDs do not exist");
    });

    it("should set default stock to 0 if not provided", async () => {
      const data = {
        name: "Test Product",
        price: 100,
      };

      const result = await ProductServices.createProduct(data, []);

      expect(result.stock).toBe(0);
    });

    it("should handle spec and sale price", async () => {
      const data = {
        name: "Test Product",
        price: 100,
        salePrice: 80,
        specs: JSON.stringify({ color: "red", size: "M" }),
        stock: 50,
      };

      const result = await ProductServices.createProduct(data, []);

      expect(result.salePrice).toBe(80);
      expect(result.specs).toEqual({ color: "red", size: "M" });
    });
  });

  describe("getAllProduct", () => {
    it("should get all products", async () => {
      await Product.create([
        {
          name: "Product 1",
          price: 100,
          slug: "product-1",
          stock: 10,
        },
        {
          name: "Product 2",
          price: 200,
          slug: "product-2",
          stock: 20,
        },
      ]);

      const result = await ProductServices.getAllProduct();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Product 1");
      expect(result[1].name).toBe("Product 2");
    });

    it("should return empty array if no products", async () => {
      const result = await ProductServices.getAllProduct();

      expect(result).toEqual([]);
    });
  });

  describe("searchAndFilterProducts", () => {
    beforeEach(async () => {
      const category = await Category.create({
        name: "Electronics",
        slug: "electronics",
      });

      await Product.create([
        {
          name: "Laptop",
          price: 1000,
          slug: "laptop",
          brand: "Dell",
          categories: [category._id],
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          name: "Mouse",
          price: 50,
          slug: "mouse",
          brand: "Logitech",
          categories: [category._id],
          createdAt: new Date(Date.now() - 172800000),
        },
        {
          name: "Keyboard",
          price: 150,
          slug: "keyboard",
          brand: "Corsair",
          categories: [category._id],
          createdAt: new Date(),
        },
      ]);
    });

    it("should search products by name", async () => {
      const result = await ProductServices.searchAndFilterProducts({
        search: "Laptop",
      });

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Laptop");
    });

    it("should filter by price range", async () => {
      const result = await ProductServices.searchAndFilterProducts({
        minPrice: 100,
        maxPrice: 500,
      });

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Keyboard");
    });

    it("should sort by price descending", async () => {
      const result = await ProductServices.searchAndFilterProducts({
        sort: "price_desc",
      });

      expect(result.products[0].price).toBe(1000);
      expect(result.products[result.products.length - 1].price).toBe(50);
    });

    it("should sort by newest by default", async () => {
      const result = await ProductServices.searchAndFilterProducts({});

      expect(result.products[0].name).toBe("Keyboard");
    });

    it("should paginate results", async () => {
      const result = await ProductServices.searchAndFilterProducts({
        page: 1,
        limit: 2,
      });

      expect(result.products).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
    });
  });
});
