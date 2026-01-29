const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

     description: {
      type: String,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const availabilitySchema = new Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const providerSchema = new Schema(
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

    bio: {
      type: String,
      maxlength: 500,
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
      enum: ["provider"],
      default: "provider",
    },

    services: [serviceSchema],

    availability: [availabilitySchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Provider = model("Provider", providerSchema);

module.exports = Provider;
