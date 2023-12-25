const Role = require("../models/role");
const { validationResult } = require("express-validator");
const slugify = require("slugify");
const ValidationError = require("../helpers/errors/ValidationError.js");
const InternalError = require("../helpers/errors/InternalError.js");
const success = require("../helpers/success.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");

exports.createRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { name, permissions } = req.body;

    const role = new Role({
      name,
      permissions,
    });
    const newRole = await role.save();
    return res.json(success(newRole));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});

    return res.json(success(roles));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(error));
  }
};

exports.getRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return next(new ResourceNotFoundError("Role", id));
    }
    return res.json(success(role));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(error));
  }
};

exports.updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return next(new ResourceNotFoundError("Role", id));
    }
    role.name = name;
    role.permissions = permissions;
    const updatedRole = await role.save();
    await updatedRole.populate({
      path: "permissions",
      select: ["name", "description", "slug"],
    });

    return res.json(success(updatedRole));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(error));
  }
};

exports.deleteRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({ _id: id });
    if (!role) {
      return next(new ResourceNotFoundError("Role", id));
    }
    await Role.findByIdAndDelete(id);
    return res.status(204).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(error));
  }
};
