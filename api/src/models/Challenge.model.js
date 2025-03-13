import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
  {
    description: { type: String, required: true },
    type: { type: String, enum: ["daily", "weekly"], required: true },
    rewardAura: { type: Number, default: 0 },
    rewardCredits: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    // For tracking which teacher created the challenge
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    // Optionally, track if a challenge is globally available
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model("Challenge", challengeSchema);
