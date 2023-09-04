import * as express from "express";
const router = express.Router();
// Middlewares
import { isAuthenticated } from './../../middleware';
import { save, list, projectDetails, checkStatus} from './project.controller'

// Routes
router.post('/save',isAuthenticated,save)
router.get('/list',isAuthenticated,list)
router.get('/details',isAuthenticated,projectDetails)
router.get('/checkStatus',isAuthenticated,checkStatus)

export default router;