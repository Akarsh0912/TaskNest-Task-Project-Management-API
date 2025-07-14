import express from "express"
import authRouter from "./auth.routes.js"
import projectRuter from "./project.routes.js"
import taskRouter from "./task.routes.js"
import commentRouter from "./comment.routes.js"
import activityRouter from "./activity.routes.js"
import auditRouter from "./audit.routes.js"

const router = express.Router();

router.use("/auth",authRouter);
router.use("/project",projectRuter);
router.use("/task",taskRouter);
router.use("/comment",commentRouter);
router.use("/activity",activityRouter);
router.use("/audit-trail",auditRouter);



export default router