const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.js");

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  createCategory
);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  updateCategory
);

router.delete("/:id", deleteCategory);

module.exports = router;
