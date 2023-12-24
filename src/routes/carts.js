const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getCartByUserId,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  deleteAllCartProducts,
} = require("../controllers/cartsController");

const { isAuth } = require("../middlewares/isAuth");

router.get("/", isAuth, getCartByUserId);

router.post(
  "/",
  isAuth,
  [body("productId").notEmpty(), body("quantity").notEmpty()],
  addProductToCart
);

router.delete(
  "/productId/:productId",
  isAuth,
  [body("productId").notEmpty()],
  removeProductFromCart
);

router.put(
  "/productId/:productId",
  isAuth,
  [body("productId").notEmpty(), body("quantity").notEmpty()],
  updateProductQuantity
);

router.delete("/deleteAllCartProducts", isAuth, deleteAllCartProducts);

module.exports = router;
