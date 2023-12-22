const Product = require("../models/product.js");
const Brand = require("../models/brand.js");
const Category = require("../models/category.js");
const { validationResult } = require("express-validator");
const ValidationError = require("../helpers/errors/ValidationError.js");
const InternalError = require("../helpers/errors/InternalError.js");
const success = require("../helpers/success.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, description, price, brand, category, images } = req.body;

    const product = new Product({
      name,
      description,
      price,
      brand,
      category,
      images,
    });

    await product.save();

    return res.json(success(product));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate("brand")
      .populate("category");

    return res.json(success(products));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id })
      .populate("brand")
      .populate("category");

    if (!product) {
      return res.status(404).json(new ResourceNotFoundError("Product", id));
    }

    return res.json(success(product));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { id } = req.params;
    const { name, description, price, brand, category, images } = req.body;

    const productExisit = await Product.findOne({ _id: id });

    if (!productExisit) {
      return res.status(404).json(new ResourceNotFoundError("Product", id));
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        brand,
        category,
        images,
      },
      { new: true }
    );

    return res.json(success(product));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productExisit = await Product.findOne({ _id: id });

    if (!productExisit) {
      return res.status(404).json(new ResourceNotFoundError("Product", id));
    }

    await Product.findByIdAndDelete(id);

    return res.status(204).json(success("", 204));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};
