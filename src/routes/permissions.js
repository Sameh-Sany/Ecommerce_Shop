const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionsController.js");

router.post(
  "/",
  [
    body("name").isString().notEmpty(),
    body("description").isString().notEmpty(),
  ],
  createPermission
);

router.get("/", getPermissions);

router.get("/:id", getPermission);

router.put(
  "/:id",
  [
    body("name").isString().notEmpty(),
    body("description").isString().notEmpty(),
  ],
  updatePermission
);

router.delete("/:id", deletePermission);

module.exports = router;
