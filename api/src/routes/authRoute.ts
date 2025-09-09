import { Router } from 'express';
import {
  createUserRequest,
  forgotPassword,
  resetPassword,
  verifyAndCreateUser,
  validateResetLink,
  getUsers,
} from '../controllers/authController';
const router = Router();

// Route to handle auth related resourses.

// For attempting to create a user. See the controller
// for more details.
router.route('/sign-up').post(createUserRequest);
router.route('/verify-user/:id').get(verifyAndCreateUser);

// forgot password functionality
router.route('/forgot-password').post(forgotPassword);

// reset password functionality
router.route('/reset-password/:id').get(validateResetLink).post(resetPassword);

// dummy in place
router.route('/get').get(getUsers);

// dummy in place
router.route('/sign-in').post((req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: 'success',
  });
});

export default router;
