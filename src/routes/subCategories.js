const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoriesController");

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  createSubCategory
);

router.get("/", getSubCategories);

router.get("/:id", getSubCategory);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  updateSubCategory
);

router.delete("/:id", deleteSubCategory);

module.exports = router;
