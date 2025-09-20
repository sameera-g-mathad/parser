import { Router, Request, Response } from 'express';
import {
  deleteById,
  getMe,
  getUploads,
  getUploadPdfUrl,
  requestLLM,
  uploadFile,
} from '../controllers/appController';
import multer from 'multer';

// Route to handle app related resourses.
// once users are loggedIn.
// create a multer instance to store files
// in buffer.
// signature of how multer handle files.
const storage = multer.diskStorage({
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    // store filename format: <user_id>_<date>_<filename>;
    const fileName = `${req.user.id}_${Date.now()}_${file.originalname}`;
    callback(null, fileName);
  },
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    // Folder name be changed to be a env var.
    callback(null, '/shared');
  },
});

const upload = multer({ storage });

const router = Router();

// returns the status of the user
// loggedIn or not.
router.route('/me').get(getMe);

// route to upload files -> [multer uploads to a volume, uploadFile passes it onto worker.]
router.route('/upload').post(upload.single('file'), uploadFile);

// to get all the uploaded files.
router.route('/get-uploads').get(getUploads);

// Serve requests for the upload id.
router
  .route('/uploads/:id')
  .get(getUploadPdfUrl)
  .post(requestLLM)
  .delete(deleteById);

export default router;
