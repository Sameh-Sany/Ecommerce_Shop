const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const db = require("./src/config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
require("./src/config/passport");
require("dotenv").config();

// import elasticsearch data management routes
const data = require("./src/helpers/elasticsearch/data_management/retrieve_and_ingest_data");
const productsSearch = require("./src/routes/productsSearch");

// import error handling
const BaseError = require("./src/helpers/errors/BaseError");
const RouteNotFoundError = require("./src/helpers/errors/RouteNotFoundError");

// import routes
const authRoutes = require("./src/routes/auth.js");
const googleAuthRoutes = require("./src/routes/google-auth.js");
const categoriesRoutes = require("./src/routes/categories.js");
const brandsRoutes = require("./src/routes/brands.js");
const productsRoutes = require("./src/routes/products.js");
const subcategoriesRoutes = require("./src/routes/subCategories.js");
const cartRoutes = require("./src/routes/carts.js");
const permissionsRoutes = require("./src/routes/permissions.js");
const rolesRoutes = require("./src/routes/roles.js");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", googleAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/roles", rolesRoutes);

// elasticsearch data management routes
app.use("/api/ingest_data", data);
app.use("/api", productsSearch);

// Error handling
app.use("*", (req, res, next) => {
  next(
    new RouteNotFoundError(
      "You reached a route that is not defined on this server"
    )
  );
});

app.use((err, req, res, next) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }
  console.log(err);
  next();
});
process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

// Connect to MongoDB
db.connect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
