const Permission = require("../models/permission");
const User = require("../models/user");

const checkRolePermissions = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const userPermissions = user.permissions;
      const userRole = user.role;

      const checkUserRoles = await User.findOne({ role: userRole });

      const userRolePermissions = await Permission.find({
        _id: { $in: userPermissions },
      });
      const userRolePermissionsIds = userRolePermissions.map((permission) =>
        permission._id.toString()
      );
      const isPermissionAllowed = userRolePermissionsIds.includes(
        permission.toString()
      );
      if (!isPermissionAllowed) {
        return res.status(403).json({
          message: "You don't have permission to do this",
        });
      }
      return next();
    } catch (err) {
      console.log(err);
      return res.status(500).json(new InternalError(err));
    }
  };
};

module.exports = checkRolePermissions;
