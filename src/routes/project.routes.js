import express from 'express'
import { auth } from "../middlewares/auth.middleware.js"
import {
    createProject,
    addMember,
    removeMember,
    getMyProject
} from "../controllers/project.controller.js"

const router = express.Router()

router.route("/create-project").post(auth,createProject)
router.route("/add-member").post(auth,addMember)
router.route("/remove-member/:projectId/:userId").delete(auth,removeMember);
router.route("/getMyProject").get(auth,getMyProject)


export default router
