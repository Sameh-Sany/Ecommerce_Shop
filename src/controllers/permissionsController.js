const Permission = require("../models/permission");
const { validationResult } = require("express-validator");
const slugify = require("slugify");
const ValidationError = require("../helpers/errors/ValidationError.js");
const InternalError = require("../helpers/errors/InternalError.js");
const success = require("../helpers/success.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createPermission = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true });

    const permission = await Permission.findOne({ slug });

    if (permission) {
      return next(new ResourceAlreadyExistError("Permission"));
    }

    const newPermission = new Permission({ name, description, slug });

    await newPermission.save();

    return res.json(success(newPermission));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    return res.json(success(permissions));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.getPermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findOne({ _id: id });
    if (!permission) {
      return next(new ResourceNotFoundError("Permission"));
    }
    return res.json(success(permission));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.updatePermission = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }
    const { id } = req.params;
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true });

    const permission = await Permission.findById(id);

    if (!permission) {
      return next(new ResourceNotFoundError("Permission"));
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { name, description, slug },
      { new: true }
    );

    return res.json(success(updatedPermission));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

exports.deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findById(id);
    if (!permission) {
      return next(new ResourceNotFoundError("Permission"));
    }
    await Permission.findByIdAndDelete(id);
    return res.status(204).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};
