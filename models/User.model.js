const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },

    name: {
      type: String,
      required: [true, "Name is required."],
    },

    phone: {
      type: String,
    },

    image: {
      url: {
        type: String,
        required: true,
      },

      public_id: {
        type: String,
        required: true,
      },
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("User", userSchema);
