import * as express from "express";
const router = express.Router();

// Routers
import User from "./modules/user/user.router";
import Project from "./modules/project/project.router"
import Issues from "./modules/Issue/issue.router"
// Routes
router.use('/user', User);
router.use('/project', Project)
router.use('/issue', Issues)

export default router;
