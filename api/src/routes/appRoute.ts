import { Router, Request, Response } from 'express';
import { getMe, uploadFile } from '../controllers/appController';
import multer from 'multer';

// Route to handle app related resourses.
// once users are loggedIn.

// create a multer instance to store files
// in buffer.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// returns the status of the user
// loggedIn or not.
router.route('/me').get(getMe);

router.route('/upload').post(upload.single('file'), uploadFile);

export default router;
