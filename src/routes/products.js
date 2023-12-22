const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  updateProduct
);

router.delete("/:id", deleteProduct);

module.exports = router;
