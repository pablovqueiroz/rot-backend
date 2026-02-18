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
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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
        required: function () {
          return !this.googleId;
        },
      },

      public_id: {
        type: String,
        required: function () {
          return !this.googleId;
        },
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
