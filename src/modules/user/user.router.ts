import * as express from "express";
const router = express.Router();
// Middlewares
import { isAuthenticated } from './../../middleware';
import { save,login,deleteUser,logList,list} from './user.controller'

// Routes
router.post('/save',isAuthenticated,save)
router.post('/login',  login)
router.delete('/deleteUser', isAuthenticated, deleteUser)
router.get('/logList', isAuthenticated, logList)
router.get('/list', list)


export default router;