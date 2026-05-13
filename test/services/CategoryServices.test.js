const CategoryServices = require("../../src/services/CategoryServices");
const Category = require("../../src/models/Category");

describe("CategoryServices", () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      const result = await CategoryServices.createCategory({
        name: "Electronics"
      });

      expect(result.name).toBe("Electronics");
      expect(result.slug).toBe("electronics");
    });

    it("should throw error if category already exists", async () => {
      await Category.create({
        name: "Electronics",
        slug: "electronics",
      });

      await expect(
        CategoryServices.createCategory({name: "Electronics"})
      ).rejects.toThrow();
    });
  });

  describe("getAllCategories", () => {
    it("should get all categories", async () => {
      await Category.create([
        { name: "Electronics", slug: "electronics" },
        { name: "Clothing", slug: "clothing" },
      ]);

      const result = await CategoryServices.getAllCategories();

      expect(result).toHaveLength(2);
    });

    it("should return empty array if no categories", async () => {
      const result = await CategoryServices.getAllCategories();

      expect(result).toEqual([]);
    });
  });

  describe("updateCategory", () => {
    it("should update category successfully", async () => {
      const category = await Category.create({
        name: "Electronics",
        slug: "electronics",
      });

      const result = await CategoryServices.updateCategory(
        category._id,
        { name: "Updated Electronics" }
      );

      expect(result.name).toBe("Updated Electronics");
      expect(result.slug).toBe("updated-electronics");
    });

    it("should throw error if category not found", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      await expect(
        CategoryServices.updateCategory(nonExistentId, "Name", "slug")
      ).rejects.toThrow();{name: "Name"}
    });
  });

  describe("deleteCategory", () => {
    it("should delete category successfully", async () => {
      const category = await Category.create({
        name: "Electronics",
        slug: "electronics",
      });

      const result = await CategoryServices.deleteCategory(category._id);

      expect(result._id).toEqual(category._id);

      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory).toBeNull();
    });

    it("should throw error if category not found", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      await expect(
        CategoryServices.deleteCategory(nonExistentId)
      ).rejects.toThrow();
    });
  });
});
