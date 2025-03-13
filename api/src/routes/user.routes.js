import { Router } from "express";
import multer from 'multer'
import { createProject, editAssignment, getAssignment, getAssignmentById, getCompletedProjects, getProjectById, getTeacherCreatedProjects, getUncompletedProjects, header, loginUser,logoutUser, postAssignment, registerUser, uploadAndSubmitProject } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getUserProfile,
  updateCompletedAssignment,
  updateUserProfile,
  getCreatedAssignments,
  getCompletedAssignments,
  getUncompletedAssignments,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addChallenge, completeChallenge, getAllChallenges, getCompletedChallenges } from "../controllers/challenge.controller.js";

const router = Router();
const uploadNone=multer()

router.route("/profile").get( isAuthenticated, getUserProfile);
router.route("/update").put( isAuthenticated, updateUserProfile);
// Route to get completed projects
router.route('/projects/completed').get( isAuthenticated,getCompletedProjects );
//route to get created Projects
router.route('/projects/created').get(isAuthenticated,getTeacherCreatedProjects)
// Route to get uncompleted projects
router.route('/projects/uncompleted').get( isAuthenticated, getUncompletedProjects);

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
router.route('/teacher/projects').get( isAuthenticated, getTeacherCreatedProjects);
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
  router.route("/projects/:id").get( getProjectById);
  router.post(
    "/submit-project/:projectId",
    isAuthenticated,
    upload.single("file"), // Uses the provided upload middleware
    uploadAndSubmitProject
  );


router.get("/challenges", isAuthenticated, getAllChallenges);

// Add a new challenge (teacher only)
router.post("/challenges/add", isAuthenticated, addChallenge);

// Mark a challenge as complete (student)
router.post("/challenges/:challengeId/complete", isAuthenticated, completeChallenge);
router.get("/challenges/completed", isAuthenticated, getCompletedChallenges);
// router.route("/")
// router.route("/")


export default router;