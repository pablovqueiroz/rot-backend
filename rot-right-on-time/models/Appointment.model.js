const { Schema, model } = require("mongoose");

const appointmentSchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
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

    date: {
      type: Date,
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

    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index(
  { client: 1, provider: 1, date: 1, startTime: 1 },
  { unique: true }
);

const Appointment = model("Appointment", appointmentSchema);

module.exports = Appointment;
