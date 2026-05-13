const UserServices = require("../../src/services/UserServices");
const User = require("../../src/models/User");
const bcrypt = require("bcrypt");

describe("UserServices", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const result = await UserServices.createUser(
        "John Doe",
        "john@example.com",
        "password123",
        "0912345678"
      );

      expect(result.status).toBe("OK");
      expect(result.message).toBe("User created successfully");
      expect(result.data).toHaveProperty("_id");
      expect(result.data.name).toBe("John Doe");
      expect(result.data.email).toBe("john@example.com");
      expect(result.data).not.toHaveProperty("password");
    });

    it("should throw error if email already exists", async () => {
      await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "0912345678",
      });

      await expect(
        UserServices.createUser(
          "Jane Doe",
          "john@example.com",
          "password456",
          "0987654321"
        )
      ).rejects.toThrow("Email already exist");
    });

    it("should throw error if password is not provided", async () => {
      await expect(
        UserServices.createUser("John Doe", "john@example.com", null, "0912345678")
      ).rejects.toThrow("Password is required");
    });

    it("should hash password correctly", async () => {
      const result = await UserServices.createUser(
        "John Doe",
        "john@example.com",
        "password123",
        "0912345678"
      );

      const user = await User.findById(result.data._id);
      const isPasswordHashed = await bcrypt.compare("password123", user.password);
      expect(isPasswordHashed).toBe(true);
    });
  });

  describe("loginUser", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        phone: "0912345678",
        isActive: true,
        role: "customer",
      });
    });

    it("should login user successfully with correct credentials", async () => {
      const result = await UserServices.loginUser(
        "john@example.com",
        "password123"
      );

      expect(result.status).toBe("OK");
      expect(result.message).toBe("Đăng nhập thành công");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe("john@example.com");
    });

    it("should throw error if email does not exist", async () => {
      await expect(
        UserServices.loginUser("notexist@example.com", "password123")
      ).rejects.toThrow("Email không tồn tại");
    });

    it("should throw error if password is incorrect", async () => {
      await expect(
        UserServices.loginUser("john@example.com", "wrongpassword")
      ).rejects.toThrow("Mật khẩu không đúng");
    });

    it("should throw error if account is inactive", async () => {
      await User.updateOne(
        { email: "john@example.com" },
        { isActive: false }
      );

      await expect(
        UserServices.loginUser("john@example.com", "password123")
      ).rejects.toThrow("Tài khoản đã bị vô hiệu hóa");
    });
  });

  describe("getUserById", () => {
    it("should get user by id successfully", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        phone: "0912345678",
      });

      const result = await UserServices.getUserById(user._id);

      expect(result._id).toEqual(user._id);
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
      expect(result.password).toBeUndefined();
    });

    it("should throw error if user does not exist", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      await expect(
        UserServices.getUserById(nonExistentId)
      ).rejects.toThrow("User không tồn tại");
    });
  });
});
