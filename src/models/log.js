import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true }, // e.g., "DELETE_USER", "RESET_VOTES"
    target: { type: mongoose.Schema.Types.Mixed }, // user ID, voter ID, etc.
    description: { type: String },
  },
  { timestamps: true }
);

export const Log = mongoose.model("Log", logSchema);
