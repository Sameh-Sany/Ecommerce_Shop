const Cart = require("../models/cart");
const { validationResult } = require("express-validator");
const InternalError = require("../helpers/errors/InternalError.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ValidationError = require("../helpers/errors/ValidationError.js");
const success = require("../helpers/success.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");
const user = require("../models/user.js");

exports.getCartByUserId = async (req, res, next) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id }).populate([
      {
        path: "user",
        select: "firstName lastName email",
      },
      {
        path: "products.product",
        select: "name price",
      },
    ]);
    if (!cart) {
      return next(new ResourceNotFoundError("Cart not found"));
    }
    return res.json(success(cart));
  } catch (error) {
    console.log(error);
    return next(new InternalError());
  }
};

exports.addProductToCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: id });

    const productIndex = cart.products.findIndex(
      (product) => product.product == productId
    );

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }
    await cart.save();
    return res.json(success(cart));
  } catch (error) {
    console.log(error);
    return next(new InternalError());
  }
};

exports.removeProductFromCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: id });

    const productIndex = cart.products.findIndex(
      (product) => product.product == productId
    );

    if (productIndex === -1) {
      return next(new ResourceNotFoundError("Product", productId));
    }
    cart.products.splice(productIndex, 1);
    await cart.save();
    return res.json(success(cart));
  } catch (error) {
    console.log(error);
    return next(new InternalError());
  }
};

exports.updateProductQuantity = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: id });

    const productIndex = cart.products.findIndex(
      (product) => product.product == productId
    );
    if (productIndex === -1) {
      return next(new ResourceNotFoundError("Product not found"));
    }
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    return res.json(success(cart));
  } catch (error) {
    console.log(error);
    return next(new InternalError());
  }
};

exports.deleteAllCartProducts = async (req, res, next) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id });
    cart.products = [];
    await cart.save();
    return res.json(success(cart));
  } catch (error) {
    console.log(error);
    return next(new InternalError());
  }
};
