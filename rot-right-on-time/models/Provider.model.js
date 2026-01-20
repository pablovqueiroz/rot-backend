const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
  { _id: false }
);

const availabilitySchema = new Schema(
  {
    dayOfWeek: {
      type: Number, // 0 = Domingo, 6 = Sábado
      required: true,
    },
    startTime: {
      type: String, // "09:00"
      required: true,
    },
    endTime: {
      type: String, // "18:00"
      required: true,
    },
  },
  { _id: false }
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
      select: false
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

    services: [serviceSchema],

    availability: [availabilitySchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Provider = model("Provider", providerSchema);

module.exports = Provider;
