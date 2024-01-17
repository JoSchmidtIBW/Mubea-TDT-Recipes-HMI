import multer from 'multer';
import sharp from 'sharp';

import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import mongoose from 'mongoose';

import User from '../models/userModel.mjs';
import {
  getAllUsers,
  updateUserFindByIdAndUpdate,
  saveCreateUser,
  deleteUserFindOneAndDelete,
} from '../models/services/userService.mjs';

// right here on the top
const multerStorage = multer.memoryStorage(); // stored as a buffer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `user-${req.user.id}-${uniqueSuffix}.jpeg`);
//   },
// });
console.log('multerStorage: ' + multerStorage);

// This filter only allows the upload of images
// test if uploaded file is an image, when true, --> cb (callBack) = filename and destination
const multerFilter = (req, file, cb) => {
  console.log('Bin multerFilter');
  if (file.mimetype.startsWith('image')) {
    //mimetype: 'image/jpeg',
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // 400 = bad request, (null(error), false)
  }
};
console.log('multerFilter: ' + multerFilter);

//const upload = multer({ dest: 'public/img/users' }) // This is the place, where all images will be save

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
console.log('upload: ' + upload);

export const uploadUserPhoto = upload.single('photo');

// Middleware to resize photo to square, must be before the updateMe- function!
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  console.log('Bin resizeUserPhoto');
  if (!req.file) return next(); // if no photo was uploaded, then next, otherwise resizing

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  console.log(req.file.filename);

  await sharp(req.file.buffer) // Image will be save in a buffer //...const multerStorage = multer.memoryStorage(); // stored as a buffer
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // 90 = 90%
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  // create a array
  const newObj = {};
  // loop to the objekt in array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  console.log('bin updateMe');
  //console.log(req.file);
  console.log(req.body);
  //console.log(req.data);

  // 1.) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.',
        400, // 400 =  bad request
      ),
    );
  }

  // 3.) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'email',
    'firstName',
    'lastName',
    'gender',
    'language',
    'role',
  );
  console.log('filteredBody: ' + filteredBody);
  console.log('JSON.stringify(filteredBody): ' + JSON.stringify(filteredBody));
  //   console.log('filteredBody:');
  //   for (const key in filteredBody) {
  //     if (Object.hasOwnProperty.call(filteredBody, key)) {
  //       console.log(`${key}: ${filteredBody[key]}`);
  //     }
  //   }

  // also add photo to the filteredBody if req.file has (photo)
  if (req.file) filteredBody.photo = req.file.filename;

  // 4.) Update user document, not with save-method!
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // because user can change his role: req.body.role: 'admin', only the fields in filteredBody are allowed
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const getAllUser = catchAsync(async (req, res, next) => {
  console.log('bin getAllUser');

  const allUsers = await getAllUsers();

  if (!allUsers) {
    return next(new AppError('No user found to load', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: allUsers,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  console.log('Bin getUser');
});

export const updateUser = catchAsync(async (req, res, next) => {
  console.log('Bin getUpdateUser...');
  console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));
  //console.log('req.body.data: ' + req.body.data);

  const userID = req.params.id;
  console.log('userID: ' + userID);
  const updateUserData = req.body;

  const updatedUser = await updateUserFindByIdAndUpdate(updateUserData, userID);

  console.log('updateUser IN Controller: ' + updatedUser);
  if (!updatedUser) {
    // Null is false
    return next(new AppError('No document (user) found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});

// export const createUser = catchAsync(async (req, res, next) => {
//   console.log('Bin createUser');

//   console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));

//   //const createUser = await createDOK

//   // if (!createUser) {
//   //   // Null is false
//   //   return next(new AppError('No document (user) found with that ID', 400));//400 bad request????
//   // }

//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     data: createUser,
//   //   },
//   // });
// });

export const createUser = catchAsync(async (req, res, next) => {
  console.log('bin createUser');

  console.log(req.body);
  console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));

  // console.log(req.body.birthDate);
  const dateArr = req.body.birthDate.split('.');
  const year = dateArr[2];

  // console.log(year);
  // console.log(new Date().getFullYear());
  const yearNow = new Date().getFullYear();

  if (year >= yearNow.toString()) {
    return next(
      new AppError('The Birth date can not be real...! Please try again.', 400),
    ); // 400 = bad request
  }

  console.log('req.body.department.length: ' + req.body.department.length);
  if (req.body.department.length == 0) {
    console.log('Die Länge ist 0!');
    return next(
      new AppError('Abteilung muss mindestens eine angewählt werden!', 400),
    );
  }

  const newUserData = {
    employeeNumber: req.body.employeeNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
    gender: req.body.gender,
    language: req.body.language,
    professional: req.body.professional,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
    photo: req.body.photo,
    department: req.body.department,
    active: req.body.active,
  };

  const newUser = await saveCreateUser(newUserData);
  // const newUser = new User(userData);
  // await newUser.save();

  if (!newUser) {
    return next(
      new AppError('Fehler beim Speichern eines neuen Benutzers!', 400),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'A new user is succefully created!',
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  console.log('Bin deleteUser');

  const userID = req.params.id;
  console.log('userID to delete: ' + userID);
  // console.log('req.body: ' + JSON.stringify(req.body));
  // console.log('req.params: ' + JSON.stringify(req.params));
  const deletedUser = await deleteUserFindOneAndDelete(userID);

  if (!deletedUser) {
    // Null is false
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export default updateMe;

// // For getOne --> there id comes from query, but we want the id from based- user ( id from logt in user )
// export const getMe = (req, res, next) => {
//   // before calling getOne
//   req.params.id = req.user.id;

//   next();
// };
