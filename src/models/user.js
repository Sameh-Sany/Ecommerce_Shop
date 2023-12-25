const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
    },
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    verificationCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: function (doc, result, options) {
    delete result.password;
    return result;
  },
});

module.exports = mongoose.model("User", userSchema);
