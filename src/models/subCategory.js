const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
