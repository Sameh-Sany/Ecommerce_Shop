const { validationResult } = require("express-validator");
const InternalError = require("../helpers/errors/InternalError.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const Brand = require("../models/brand.js");
const ValidationError = require("../helpers/errors/ValidationError.js");
const success = require("../helpers/success.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, image } = req.body;

    const checkBrandExisit = await Brand.findOne({ name });
    if (checkBrandExisit) {
      return next(new ResourceAlreadyExistError("Brand", name));
    }

    const brand = await Brand.create({
      name,
      image,
    });

    return res.json(success(brand));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({});
    return res.json(success(brands));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ _id: id });

    if (!brand) return next(new ResourceNotFoundError("brand", id));

    return res.json(success(brand));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { id } = req.params;
    const { name, image } = req.body;

    const brand = await Brand.findOneAndUpdate(
      { _id: id },
      { name, image },
      { new: true }
    );

    if (!brand) return next(new ResourceNotFoundError("brand", id));

    return res.json(success(brand));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOneAndDelete({ _id: id });

    if (!brand) return next(new ResourceNotFoundError("brand", id));
    return res.status(204).json(success("", 204));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new InternalError(error));
  }
};
