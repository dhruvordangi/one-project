import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    aura_points: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "teacher"], // Ensure valid roles
      default: "student",
    },
    Assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    // Teacher-specific fields
    createdAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments created by a teacher
      },
    ],
    // Student-specific fields
    completedAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments completed by a student
      },
    ],
  },
  { timestamps: true }
);

// Ensure default empty arrays for relevant fields
userSchema.path("Assignments").default(() => []);
userSchema.path("createdAssignments").default(() => []);
userSchema.path("completedAssignments").default(() => []);

export const User = mongoose.model("User", userSchema);
