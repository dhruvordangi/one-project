import { Router } from "express";
import multer from 'multer'
import { editAssignment, getAssignment, getAssignmentById, header, loginUser, logoutUser, postAssignment, registerUser } from "../controllers/user.controller.js";

const router= Router()
const upload=multer()

router.route("/register").post(registerUser)
router.route("/header").get(header)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/assignment").post(upload.none(), postAssignment)
router.route("/assignment").get(getAssignment)
router.route("/assignment/:id").get(getAssignmentById)
router.route("/assignment").put(upload.none(), editAssignment)
// router.route("/")
// router.route("/")

export default router;