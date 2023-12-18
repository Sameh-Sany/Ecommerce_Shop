const Category = require("../models/category");
const { validationResult } = require("express-validator");
const slugify = require("slugify");
const ValidationError = require("../helpers/errors/ValidationError");
const InternalError = require("../helpers/errors/InternalError");
const success = require("../helpers/success.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, description, image } = req.body;

    const categoryExisit = await Category.findOne({ name });
    if (categoryExisit) {
      return next(new ResourceAlreadyExistError("Category", name));
    }

    const category = await Category.create({
      name,
      description,
      image,
      slug: slugify(name),
    });

    return res.json(success(category));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json(success(categories));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    return res.json(success(category));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, description, image } = req.body;
    const { id } = req.params;

    const categoryExist = await Category.findById(id);
    if (!categoryExist) return next(new ResourceNotFoundError("Category", id));

    //check name exist
    const categoryExistName = await Category.findOne({ name });
    if (categoryExistName && categoryExistName._id != id)
      return next(new ResourceAlreadyExistError("Category", name));

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { name, description, image, slug: slugify(name) },
      { new: true }
    );
    return res.json(success(category));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(new ResourceNotFoundError("category", id));
    return res.status(204).json(success("", 204));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};
