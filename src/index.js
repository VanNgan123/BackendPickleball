const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const validateEnv = require("./config/validateEnv");
const routes = require("./routers/index");
const errorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

dotenv.config();

// Validate environment variables
validateEnv();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Cho phép frontend khác origin load ảnh
  })
);
app.use(generalLimiter); // Rate limiting

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

connectDB();
routes(app);

// Error handling middleware (phải ở cuối cùng)
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
