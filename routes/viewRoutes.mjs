import express from 'express';

import {
  getTxt_Xml_FileUploader,
  getOverview,
  getOverviewInlogt,
  getLogin,
  getCreateRecipeOverview,
  getCreate2_St_2_BSB,
  getAccount,
  getManageUsers,
  getUpdateUser,
  getCreateUser,
  getUpdateRecipe,
} from '../controllers/viewsController.mjs';

import {
  protect,
  isLoggedIn,
  restrictTo,
} from '../controllers/authController.mjs';

const router = express.Router();

router.get(
  '/txt_xml_fileuploader',
  protect,
  //isLoggedIn,
  restrictTo('admin', 'Chef'),
  getTxt_Xml_FileUploader,
);
router.get('/overview', getOverview);
router.get('/login', getLogin);
router.get(
  '/overviewInlogt',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getOverviewInlogt,
);
router.get(
  '/createRecipeOverview',
  protect,
  isLoggedIn,
  getCreateRecipeOverview,
);
router.get('/create2-St-2-BSB', protect, isLoggedIn, getCreate2_St_2_BSB);

router.get(
  '/me',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getAccount,
);

router.get('/manage_users', protect, restrictTo('admin'), getManageUsers);
router.get(
  '/manage_users/:id',
  protect,
  restrictTo('admin'), //, 'Chef'),
  getUpdateUser,
);

router.get('/createUser', protect, restrictTo('admin', 'Chef'), getCreateUser);

router.get('/recipes/updateRecipe/:id', protect, getUpdateRecipe);

export default router;
