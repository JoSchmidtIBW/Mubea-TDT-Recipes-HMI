import express from 'express';

import {
  getConvertOldRecipesToMongoDB,
  getRecipesTDTtoLoad,
  getCreateRecipe2_St_2_BSB,
} from '../controllers/recipesController.mjs';

const router = express.Router();

router.post('/convertOldRecipesToMongoDB', getConvertOldRecipesToMongoDB);
router.get('/recipesTDTtoLoad', getRecipesTDTtoLoad);
router.post('/createRecipe2_St_2_BSB', getCreateRecipe2_St_2_BSB);

export default router;
