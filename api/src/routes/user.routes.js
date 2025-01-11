import { Router } from "express";
import multer from 'multer'
import { createProject, editAssignment, getAssignment, getAssignmentById, header, loginUser,logoutUser, postAssignment, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isTeacher } from "../middlewares/isTeacher.js";

import express from "express";
import {
  getUserProfile,
  updateCompletedAssignment,
  updateUserProfile,
  getCreatedAssignments,
  getCompletedAssignments,
  getUncompletedAssignments,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();
const uploadNone=multer()

router.route("/profile").get( isAuthenticated, getUserProfile);
router.route("/update").put( isAuthenticated, updateUserProfile);

// Assignment-related endpoints
router.route("/assignments/created").get( isAuthenticated, getCreatedAssignments);
router.route("/assignments/completed").get( isAuthenticated, getCompletedAssignments);
router.route("/assignments/uncompleted").get( isAuthenticated, getUncompletedAssignments);
router.put("/assignments/update-completed", isAuthenticated, updateCompletedAssignment);


router.route("/register").post(registerUser)
router.route("/header").get(isAuthenticated,header)
router.route("/login").post(loginUser)
router.route("/logout").post(isAuthenticated,logoutUser)
router.route("/assignment").post(uploadNone.none(), postAssignment)
router.route("/assignment").get(getAssignment)
router.route("/assignment/:id").get(getAssignmentById)
router.route("/assignment").put(uploadNone.none(), editAssignment)
// router.route("/upload-file").post( upload.single("file"), uploadFile);
router
  .route('/projects')
  .post(
    isAuthenticated,
    // isTeacher,
    upload.fields([
      { name: 'studentFiles', maxCount: 10 }, // Handle up to 10 student files
      { name: 'teacherFiles', maxCount: 10 }, // Handle up to 10 teacher files
    ]),
    createProject
  );
// router.route("/")
// router.route("/")


export default router;