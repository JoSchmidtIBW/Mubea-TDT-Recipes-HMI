import RecipesTDT_de from '../models/recipesTDT_de_Model.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
import { decryptPassword } from '../utils/crypto.mjs';

import {
  getFindRecipesTDTtoLoad,
  getFindRecipeTDT_deByID,
} from '../models/services/recipesTDT_de_Service.mjs';

import {
  getAllUsers,
  getFindUserByID,
} from '../models/services/userService.mjs';

export const getStart = catchAsync(async (req, res, next) => {
  res.status(200).render('start', {
    title: 'Start',
  });
});

export const getAccount = (req, res) => {
  if (req.user.language === 'de') {
    res.status(200).render('account_de', {
      title: 'Dein Konto',
      user: req.user,
    });
  } else {
    res.status(200).render('account', {
      title: 'Your account',
      user: req.user,
    });
  }
};

export const getTxt_Xml_FileUploader = catchAsync(async (req, res, next) => {
  res.status(200).render('txt_xml_FileUploader', {
    title: '.txt- .xml- FileUploader',
  });
});

export const getCreateRecipeOverview = catchAsync(async (req, res, next) => {
  res.status(200).render('createRecipeOverview', {
    title: 'createRecipeOverview',
  });
});

export const getCreate2_St_2_BSB = catchAsync(async (req, res, next) => {
  res.status(200).render('create2_St_2_BSB', {
    title: 'create2_St_2_BSB',
  });
});

export const getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'login',
  });
});

export const getOverviewInlogt = catchAsync(async (req, res, next) => {
  const recipesTDT = await getFindRecipesTDTtoLoad();
  //console.log('recipesTDT: ' + recipesTDT);
  //console.log('recipesTDT:', JSON.stringify(recipesTDT, null, 2));

  //TODO: überprüfen ob nicht eine Fehlermeldung kommen soll
  if (recipesTDT.length === 0) {
    recipesTDT = 'Es sind keine Daten gefunden worden';
  }

  res.status(200).render('overviewInlogt', {
    title: 'overviewIN',
    data: recipesTDT,
  });
});

export const getOverview = catchAsync(async (req, res, next) => {
  const recipesTDT = await getFindRecipesTDTtoLoad();
  // const recipesTDT = await RecipesTDT_de.find().sort({
  //   'kopfDaten.artikelNummer': 1,
  // });
  //console.log(recipesTDT);
  if (recipesTDT.length === 0) {
    recipesTDT = 'Es sind keine Daten gefunden worden';
  }

  res.status(200).render('overview', {
    title: 'overview',
    data: recipesTDT,
  });
});

export const getManageUsers = catchAsync(async (req, res, next) => {
  console.log('bin getManageUsers');
  const allUsers = await getAllUsers();
  //console.log('allUsers: ' + allUsers);

  //TODO: kommt hier nicht ein AppError??
  if (allUsers.length === 0) {
    allUsers = 'Es sind keine user gefunden worden';
  }

  if (req.user.language === 'de') {
    res.status(200).render('manageUsers_de', {
      title: 'Benutzerverwaltung',
      data: allUsers,
    });
  } else {
    res.status(200).render('manageUsers', {
      title: 'manageUsers',
      data: allUsers,
    });
  }
});

export const getUpdateUser = catchAsync(async (req, res, next) => {
  console.log('Bin getUpdateUser');

  const currentUser = req.user;
  const userToUpdate = await getFindUserByID(req.params.id); // User.findById(req.params.id)
  //.select('+password')
  //.populate('machinery');

  console.log('userToUpdate: ' + userToUpdate);

  // let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  // let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); //hashing the key using SHA256
  let userDecryptedPassword = await decryptPassword(userToUpdate.password);
  console.log('userDecryptedPassword: ' + userDecryptedPassword);

  // const allDepartments = await Department.find()
  //   .sort('_id')
  //   .populate('machinery');

  if (!userToUpdate) {
    return next(new AppError('There is no User with that ID.', 404));
  }

  // That no one can change the Admin
  if (userToUpdate.role === 'admin' && req.user.role !== 'admin') {
    res.status(401).render('error', {
      msg: 'You do not have permission to perform this action!',
    });
  } else if (req.user.role === 'admin') {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserByAdminPW_de', {
        title: 'Benutzer-Bearbeitung',
        data: {
          userToUpdate: userToUpdate,
          //departments: allDepartments,
          currentUser: currentUser,
          userDecryptedPassword: userDecryptedPassword,
        },
      });
    } else {
      res.status(200).render('updateUserByAdminPW', {
        title: 'Update user',
        data: {
          userToUpdate: userToUpdate,
          //departments: allDepartments,
          currentUser: currentUser,
          userDecryptedPassword: userDecryptedPassword,
        },
      });
    }
  } else {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserByChef_de', {
        title: 'Aktualisiere Benutzer',
        data: {
          userToUpdate: userToUpdate,
          //departments: allDepartments,
          currentUser: currentUser,
        },
      });
    } else {
      //   res.status(200).render('updateUserByChef', {
      //     title: 'Update user',
      //     data: {
      //       userToUpdate: userToUpdate,
      //       departments: allDepartments,
      //       currentUser: currentUser,
      //     },
      //   });
    }
  }
});

export const getCreateUser = catchAsync(async (req, res, next) => {
  console.log('bin getCreateUser');

  if (req.user.language === 'de') {
    res.status(200).render('createUser_de', {
      title: 'Benutzererstellung',
    });
  } else {
    res.status(200).render('createUser', {
      title: 'createUser',
    });
  }
});

export const getUpdateRecipe = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateRecipe');

  console.log('req.params: ' + req.params);
  console.log('req.params.id: ' + req.params.id);
  const recipeID = req.params.id;

  const recipeToUpdate = await getFindRecipeTDT_deByID(recipeID); //'blabla';
  console.log('recipeToUpdate: ' + recipeToUpdate);
  console.log(JSON.stringify(recipeToUpdate, null, 2));

  if (!recipeToUpdate) {
    return next(new AppError('There is no recipe with that ID.', 404));
  }

  res.status(200).render('updateRecipe_de', {
    title: 'Rezept- Bearbeitung',
    data: recipeToUpdate,
    //data: JSON.stringify(recipeToUpdate),
    //data: JSON.stringify(recipeToUpdate, null, 2),

    user: req.user,
  });
});
