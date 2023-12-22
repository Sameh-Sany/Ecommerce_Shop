const SubCategory = require("../models/subCategory.js");
const { validationResult } = require("express-validator");
const slugify = require("slugify");
const ValidationError = require("../helpers/errors/ValidationError.js");
const InternalError = require("../helpers/errors/InternalError.js");
const success = require("../helpers/success.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createSubCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, category, description, image } = req.body;

    const SubcategoryExisit = await SubCategory.findOne({ name });
    if (SubcategoryExisit) {
      return next(new ResourceAlreadyExistError("SubcategoryExisit", name));
    }

    const Subcategory = await SubCategory.create({
      name,
      description,
      image,
      category,
      slug: slugify(name),
    });

    return res.json(success(Subcategory));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.getSubCategories = async (req, res, next) => {
  try {
    const Subcategories = await SubCategory.find({}).populate("category");
    return res.json(success(Subcategories));
  } catch (err) {
    return res.status(500).json(new InternalError(err));
  }
};

exports.getSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Subcategory = await SubCategory.findById(id).populate("category");
    if (!Subcategory) {
      return next(new ResourceNotFoundError("Subcategory", id));
    }
    return res.json(success(Subcategory));
  } catch (err) {
    return res.status(500).json(new InternalError(err));
  }
};

exports.updateSubCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { id } = req.params;
    const { name, category, description, image } = req.body;

    const Subcategory = await SubCategory.findById(id);
    if (!Subcategory) {
      return next(new ResourceNotFoundError("Subcategory", id));
    }

    const SubcategoryExisit = await SubCategory.findOne({ name });
    if (SubcategoryExisit && SubcategoryExisit._id != id) {
      return next(new ResourceAlreadyExistError("SubcategoryExisit", name));
    }

    Subcategory.name = name;
    Subcategory.description = description;
    Subcategory.image = image;
    Subcategory.category = category;
    Subcategory.slug = slugify(name);

    await Subcategory.save();

    return res.json(success(Subcategory));
  } catch (err) {
    return res.status(500).json(new InternalError(err));
  }
};

exports.deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const Subcategory = await SubCategory.findById(id);
    if (!Subcategory) {
      return next(new ResourceNotFoundError("Subcategory", id));
    }

    await Subcategory.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (err) {
    return res.status(500).json(new InternalError(err));
  }
};
