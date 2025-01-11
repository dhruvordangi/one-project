import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
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
    section: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "CHEM_ENG", "PIE", "ME", "CE", "EE", "IT", "None"],
      default: "None",
    },
    // Assignments-related fields
    Assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    createdAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments created by a teacher
      },
    ],
    completedAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments completed by a student
      },
    ],
    // Project Submission fields
    createdProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProjectSubmission", // Projects created by a teacher
      },
    ],
    submittedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProjectSubmission", // Projects submitted by a student
      },
    ],
  },
  { timestamps: true }
);

// Ensure default empty arrays for relevant fields
userSchema.path("Assignments").default(() => []);
userSchema.path("createdAssignments").default(() => []);
userSchema.path("completedAssignments").default(() => []);
userSchema.path("createdProjects").default(() => []);
userSchema.path("submittedProjects").default(() => []);

export const User = mongoose.model("User", userSchema);
