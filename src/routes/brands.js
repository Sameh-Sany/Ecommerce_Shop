const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands");

router.get("/", getBrands);

router.get("/:id", getBrand);

router.post(
  "/",
  [
    body("name").trim().isLength({ min: 1 }),
    body("image").trim().isLength({ min: 1 }),
  ],
  createBrand
);

router.put(
  "/:id",
  [
    body("name").trim().isLength({ min: 1 }),
    body("image").trim().isLength({ min: 1 }),
  ],
  updateBrand
);

router.delete("/:id", deleteBrand);

module.exports = router;
