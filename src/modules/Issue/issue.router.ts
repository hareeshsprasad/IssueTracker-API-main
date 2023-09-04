import * as express from "express";
const router = express.Router();
// Middlewares
import { isAuthenticated } from './../../middleware';
import { issueList, save} from './issue.controller'

// Routes
router.get('/issueList',isAuthenticated,issueList)
router.post('/save',isAuthenticated,save)

export default router;