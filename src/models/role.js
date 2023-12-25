const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
