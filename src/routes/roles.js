const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
} = require("../controllers/rolesController.js");

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("permissions").isArray().withMessage("Permissions must be an array"),
  ],
  createRole
);

router.get("/", getRoles);

router.get("/:id", getRole);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("permissions").isArray().withMessage("Permissions must be an array"),
  ],
  updateRole
);

router.delete("/:id", deleteRole);

module.exports = router;
