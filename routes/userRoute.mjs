import express from 'express';

import {
  login,
  logout,
  protect,
  restrictTo,
  updatePassword,
} from '../controllers/authController.mjs';

import {
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.mjs';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);

router.get('/', protect, restrictTo('admin'), getAllUser);

//All routes are only for admin and Chef after this middleware
//router.use(restrictTo('admin', 'Chef'));

//router.post('/createNewUser', createUser);
//router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);  // funktioniert nicht, ev reihenfolge middlewares beachten
router.patch('/:id', protect, restrictTo('admin'), updateUser);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);
router.post('/createNewUser', protect, restrictTo('admin'), createUser);

export default router;
