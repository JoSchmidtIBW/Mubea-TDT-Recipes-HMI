import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

import bcrypt from 'bcryptjs';

//import Department from './departmentModel.mjs';
//import Machine from './machineModel.mjs';

import { encryptPassword, decryptPassword } from '../utils/crypto.mjs';
import CryptoJS from 'crypto-js';
import AppError from '../utils/appError.mjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A User must have a firstName'], // validator
    trim: true, // name and not space-name-space
    maxlength: [20, 'A firstName must have less or equal then 20 characters'], // validator
    minlength: [1, 'A firstName must have more or equal then 1 characters'], // validator
  },
  lastName: {
    type: String,
    required: [true, 'A User must have a lastName'],
    trim: true,
    maxlength: [20, 'A lastName must have less or equal then 20 characters'],
    minlength: [1, 'A lastName must have more or equal then 1 characters'],
  },
  employeeNumber: {
    type: Number,
    required: [true, 'A user must have a employeeNumber'],
    unique: true, // not two with the same name, it is not a validator
    trim: true,
    select: true,
  },
  birthDate: {
    type: String,
    required: [true, 'A user must have a birth date'],
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    default: 'de',
    trim: true,
  },
  professional: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'Chef', 'Schichtleiter', 'Unterhalt'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now, // not Date.now(),
    select: false, // than not see it
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // than not see the password in postman or browser
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE, not for Update  (also not work at ... user updates password)
      validator: function (el) {
        // this is the function checks if password is equal to passwordConfirm     el is element_passwortConfirm
        return el === this.password; //return true or false      abc === abc --> true
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date, // this is for resetToken expires
  active: {
    // for example to make user inactive
    type: Boolean,
    default: true, // active user, boolean = true
    select: false, // it shows not in the output if active oder inactive
  },
  department: {
    type: [String],
    default: ['Operations'],
    enum: [
      'Engineering',
      'Konstruktion',
      'IT',
      'Unterhalt',
      'Geschäfts-Führung',
      'Schweisserei',
      'Zieherei',
      'Anarbeit',
      'Operations',
    ],
  },
});

//   machinery: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Machine',
//     },
//   ],

// Checks that there can only be one admin, if only one exist, and it is himself, that he can save
// also that this pre-save-middleware does not have to be commented out, when the first user- data is loaded into mongodb
userSchema.pre('save', async function (next) {
  console.log('Bin pre-save-  schaue, das es nur ein Admin gibt');
  const adminCount = await this.constructor.countDocuments({ role: 'admin' });

  const saveFields = this;

  if (adminCount > 0 && saveFields.role === 'admin' && !saveFields.isNew) {
    // The document already exists in the database and it is an admin user
    next();
  } else if (
    adminCount > 0 &&
    saveFields.role === 'admin' &&
    saveFields.isNew
  ) {
    console.log('Es hat mehrere Admins!!!');
    console.log(
      'Dieser User kann nicht in der DB gespeichert werden: ' + saveFields,
    );
    // The document is new and it is a new admin user
    return next(new AppError('Only one admin-user is allowed!', 400));
  } else {
    // All other cases allow saving
    next();
  }
  next();
});

// Check that admin not can be deleted
userSchema.pre('findOneAndDelete', async function (next) {
  console.log('Bin pre-findOneAndDelete');
  console.log('this: ' + this);
  //console.log('JSON.stringify(this): ' + JSON.stringify(this));// Gibt Fehler
  //console.log('this.getQuery: ' + this.getQuery);
  const user = await this.model.findOne(this.getQuery());
  console.log('user: ' + user);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID (Admin) by MongoDB
  if (user.role === 'admin' || user._id.toString() === ADMIN_ID) {
    console.log(
      'Der zu löschende User ist der Admin! Dieser darf nicht gelöscht werden!',
    );
    return next(
      new AppError('User with the role admin cannot be deleted!', 400),
    );
  }

  next();
});

// Checks when the admin updates that he cannot change his role as "admin"
userSchema.pre('findOneAndUpdate', async function (next) {
  console.log(
    'bin findOneAndUpdate in userModel, schaue das Admin nicht seine rolle ändern kann',
  );

  const updatedFields = this.getUpdate();
  console.log('updatedFields: ' + updatedFields);
  console.log('updatedFields.role: ' + updatedFields.role);

  const queryConditions = this.getQuery(); // Erhalte die Bedingungen der Abfrage, weil dies nicht mit "this..." angeblich geht
  console.log('queryConditions: ' + queryConditions);

  //const user = await this.findOne();
  const user = await this.model.findOne(queryConditions);
  console.log('user: ' + user);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID (Admin) by MongoDB

  if (user._id.toString() === ADMIN_ID) {
    console.log('ID ist diese vom ADMIN! Admin darf seine rolle nicht ändern!');
    if (updatedFields.role && updatedFields.role !== user.role) {
      return next(new AppError('Admin cannot update role field', 400));
    }
  }

  next();
});

// Against bruteforce- attack (if hacker can access db, and sees all pw in it)
// This document pre-save-middleware make all password to a encrypted password, when password is updated or new
userSchema.pre('save', async function (next) {
  console.log('bin pre-save im userModel');
  console.log('this.password  in pre-save: ' + this.password);
  // if not changed the password, make next, go to next middleware, otherwise, stay in it
  if (!this.isModified('password')) return next(); // this, is the actually document, isModified is function when something in the document is being modified, needs name of the field that is being modified

  // console.log('key: ' + key);
  // this.password = encryptPassword(this.password, key);
  this.password = encryptPassword(this.password);
  console.log('encryptPassword  in pre-save: ' + this.password);

  // after that, confirmPassword must be deleted, because only hashPassword exists, with set to undefined
  // Delete the passwordConfirm field
  this.passwordConfirm = undefined; // required input, not input in database
  //this.cryptoKey = key;
  next(); // passwordConfirm is only needed at the beginning so that the user does not make a mistake
});

// Return true or false
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  console.log('bin methods.correctPassword');
  console.log('userPassword: ' + userPassword);
  console.log('this.password: ' + this.password);
  console.log('candidatePassword: ' + candidatePassword);

  //let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);
  //console.log('key: ' + key);
  //let decryptedPassword = decryptPassword(this.password, key); //this.cryptoKey);
  let decryptedPassword = decryptPassword(userPassword);

  console.log('Decrypted data in correctPassword: ', decryptedPassword);

  if (decryptedPassword === candidatePassword) {
    console.log('Passwords match!');
    return true;
  } else {
    console.log('Passwords do not match!');
    return false;
  }

  return false;
};

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  // return false, --> user has not change password, after the token was issued
  if (this.passwordChangeAt) {
    // if user never changed password, this does not exist
    console.log(
      'passwordChangeAt, JWTTimestamp: ' + passwordChangeAt,
      JWTTimestamp,
    ); // output with milliseconds

    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    ); // base is 10 numbers
    console.log(
      'changedTimestamp, JWTTimestamp: ' + changedTimestamp,
      JWTTimestamp,
    );
    return JWTTimestamp < changedTimestamp; // token time 100, pw changed time 200
  }

  // false means not changed
  return false; //token time 300, pw changed time 200
};

// // Inactive
// userSchema.methods.createPasswordResetToken = function () {
//   // password- reset- token should be a randomString
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   console.log({ resetToken }, this.passwordResetToken); // logged as an object resetToken32, and resetTokenHash

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 * 60 * 1000 = 10 minutes   not saved in db, only modified
//   return resetToken;
// };

// // Inactive
// //this function would be intended when user wants to make his account (deleteME) inactive. The user would be deleted but not in the db, and so you do not see at "getalluser", only sees all active accounts
// userSchema.pre(/^find/, function (next) {
//   //this.find({ active: true }); // but then it doesn't show any users in getalluser, because the existing ones don't have it yet!
//   this.find({ active: { $ne: false } });
//   next();
// });

const User = mongoose.model('User', userSchema);

export default User;

//----------------------------------------------ALT--------------------------------------------------------------------------------

// auslagern
// function decryptPassword(encryptedPassword, key) {
//   // Parse den kombinierten Wert aus Base64
//   let combined = CryptoJS.enc.Base64.parse(encryptedPassword);

//   // Extrahiere IV und verschlüsselten Text
//   let iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
//   let ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));

//   let decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// function encryptPassword(password, key) {
//   let iv = CryptoJS.lib.WordArray.random(16); // Generiere einen zufälligen IV
//   let encrypted = CryptoJS.AES.encrypt(password, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   // Kombiniere IV und verschlüsselten Text und konvertiere in Base64
//   let combined = CryptoJS.lib.WordArray.create();
//   combined.concat(iv);
//   combined.concat(encrypted.ciphertext);

//   return combined.toString(CryptoJS.enc.Base64);
// }

// Beispielaufruf

// function testEncryptionDecryption(data, key, iv) {
//   let encrypted = CryptoJS.AES.encrypt(data, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   let decrypted = CryptoJS.AES.decrypt(
//     { ciphertext: encrypted.ciphertext },
//     key,
//     {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     },
//   );

//   console.log('Original data:', data);
//   console.log('Encrypted data:', encrypted.toString());
//   console.log('Decrypted data:', decrypted.toString(CryptoJS.enc.Utf8));
// }

// this function checks if the entered password matches the password in the db and returns true if it matches
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   console.log('userPassword: ' + userPassword);
//   console.log('candidatePassword: ' + candidatePassword);

//   //this.password does not work, because password is secret = false!
//   // candidatePassword is coming from the user, it is not hash, userPassword is hash

//   let iv = CryptoJS.enc.Base64.parse(''); // giving empty initialization vector
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // hashing the key using SHA256
//   // let decrypteddata = decryptData(userPassword, iv, key);
//   // console.log('methods.correctPassword decrypteddata: ' + decrypteddata);

//   let decrypted = CryptoJS.AES.decrypt(userPassword, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   console.log('Decrypted userPassword: ', decrypted);
//   console.log(
//     'Decrypted userPassword.toString(CryptoJS.enc.Utf8): ',
//     decrypted.toString(CryptoJS.enc.Utf8),
//   );

//   let decrypteddata = decrypted.toString(CryptoJS.enc.Utf8);
//   console.log('Decrypted data in correctPassword: ', decrypteddata);

//   if (decrypteddata === candidatePassword) {
//     return true;
//   } else {
//     return false;
//   }
//   return false;
// };

// this function checks if the entered password matches the password in the db and returns true if it matches
//
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   console.log('userPassword: ' + userPassword);
//   console.log('candidatePassword: ' + candidatePassword);

//   let iv = CryptoJS.enc.Base64.parse(''); // leeres Initialisierungsvektor
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // Hashing des Schlüssels mit SHA256

//   let decrypted = CryptoJS.AES.decrypt(userPassword, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   console.log('Decrypted userPassword: ', decrypted);

//   let decrypteddata = decrypted.toString(CryptoJS.enc.Utf8);
//   console.log('Decrypted data in correctPassword: ', decrypteddata);

//   console.log('Candidate password for comparison: ', candidatePassword);

//   if (decrypteddata === candidatePassword) {
//     console.log('Passwords match!');
//     return true;
//   } else {
//     console.log('Passwords do not match!');
//     return false;
//   }
// };

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   console.log('userPassword: ' + userPassword);
//   console.log('Encrypted userPassword:', userPassword);
//   console.log('candidatePassword: ' + candidatePassword);

//   //let iv = CryptoJS.enc.Base64.parse(''); // leeres Initialisierungsvektor
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // Hashing des Schlüssels mit SHA256
//   let iv = CryptoJS.enc.Base64.parse(userPassword.substr(0, 24)); // Extrahiere die ersten 24 Zeichen als IV

//   let decrypted = CryptoJS.AES.decrypt(userPassword, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   console.log('Decrypted userPassword: ', decrypted);

//   let decrypteddata = decrypted.toString(CryptoJS.enc.Utf8).trim(); // Hier wird trim() hinzugefügt
//   //let decrypteddata = decrypted.toString(CryptoJS.enc.Utf8).trim();

//   console.log('Length of decrypteddata:', decrypteddata.length);
//   console.log('Length of candidatePassword:', candidatePassword.length);

//   console.log('Decrypted data in correctPassword: ', decrypteddata);

//   console.log('Candidate password for comparison: ', candidatePassword);
//   console.log(
//     'Hex representation of decrypteddata:',
//     Buffer.from(decrypteddata, 'utf-8').toString('hex'),
//   );
//   console.log(
//     'Hex representation of candidatePassword:',
//     Buffer.from(candidatePassword, 'utf-8').toString('hex'),
//   );

//   if (decrypteddata === candidatePassword) {
//     console.log('Passwords match!');
//     return true;
//   } else {
//     console.log('Passwords do not match!');
//     return false;
//   }
// };

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   // console.log('toString userPassword: ' + toString(userPassword));
//   // console.log('toString candidatePassword: ' + toString(candidatePassword));
//   console.log('toString userPassword: ' + String(userPassword));
//   console.log('toString candidatePassword: ' + String(candidatePassword));

//   let iv = CryptoJS.enc.Base64.parse(''); // leeres Initialisierungsvektor
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // Hashing des Schlüssels mit SHA256

//   let decrypted2 = CryptoJS.AES.decrypt(userPassword, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   console.log('Decrypted userPassword: ', decrypted2);

//   let decrypteddata2 = decrypted2.toString(CryptoJS.enc.Utf8);
//   console.log('Decrypted data in correctPassword: ', decrypteddata2);

//   if (decrypteddata2 === candidatePassword) {
//     return true;
//   } else {
//     console.log('Password incorrect');
//     return false;
//   }
// };

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   console.log('userPassword: ' + userPassword);
//   console.log('candidatePassword: ' + candidatePassword);

//   let iv = CryptoJS.enc.Base64.parse(''); // leeres Initialisierungsvektor
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // Hashing des Schlüssels mit SHA256

//   let decrypted = CryptoJS.AES.decrypt(userPassword, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   console.log('Decrypted userPassword: ', decrypted);

//   let decrypteddata = decrypted.toString(CryptoJS.enc.Utf8);
//   console.log('Decrypted data in correctPassword: ', decrypteddata);

//   if (decrypteddata === candidatePassword) {
//     return true;
//   } else {
//     return false;
//   }
// };

// // this function checks if the entered password matches the password in the db and returns true if it matches
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   console.log('bin methods.correctPassword');
//   console.log('userPassword: ' + userPassword);
//   console.log('candidatePassword: ' + candidatePassword);

//   //this.password does not work, because password is secret = false!
//   // candidatePassword is coming from the user, it is not hash, userPassword is hash

//   let iv = CryptoJS.enc.Base64.parse(''); // giving empty initialization vector
//   let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // hashing the key using SHA256
//   let decrypteddata = decryptData(userPassword, iv, key);
//   console.log('decrypteddata: ' + decrypteddata);

//   //var encryptedStringPasswortLClient; // has to be var!
//   // let data = userPassword; //this.password; // test1234 --> UcOdDFH3nfVSNAkY53aMFQ==
//   // let iv = CryptoJS.enc.Base64.parse(''); // giving empty initialization vector
//   // let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); // hashing the key using SHA256

//   // console.log('data: ' + data);
//   // console.log('iv: ' + iv);
//   // console.log('key: ' + key);

//   // //encryptedStringPasswortLClient = encryptData(data, iv, key);
//   // let decrypteddata = decryptData(data, iv, key);
//   // console.log('decrypteddata in pre-save: ' + decrypteddata);

//   //this.password = encryptedStringPasswortLClient;

//   if (decrypteddata === candidatePassword) {
//     return true;
//   } else {
//     return false;
//   }
//   return false;
// };

// // Checks if the department exists and the user only saves himself in it once, when creating a user
// // and if the user has multiple departments, check every department, if they exists and save the user once
// userSchema.pre('save', async function (next) {
//   if (this.department && Array.isArray(this.department)) {
//     try {
//       console.log('this.department: ' + this.department);
//       for (const dep of this.department) {
//         const department = await Department.findOne({ name: dep });
//         if (department) {
//           if (!department.employees.includes(this._id)) {
//             department.employees.push(this._id);
//             await department.save();
//           } else {
//             console.log('Der Benutzer ist bereits in dieser Abteilung');
//           }
//         }
//       }
//     } catch (error) {}
//   } else if (this.department) {
//     try {
//       const department = await Department.findOne({ name: this.department });
//       if (department) {
//         if (!department.employees.includes(this._id)) {
//           department.employees.push(this._id);
//           await department.save();
//         } else {
//           console.log('Der Benutzer ist bereits in dieser Abteilung');
//         }
//       }
//     } catch (error) {}
//   }
//   next();
// });

// // update all departments, Checks if user is assigned to departments and checks that
// // the user does not appear more than once in the same department
// userSchema.pre('findOneAndUpdate', async function (next) {
//   const { department } = this._update;

//   if (department) {
//     const newDepartments = await Department.find({ name: { $in: department } });

//     const user = await User.findById(this._conditions._id);
//     const oldDepartments = user.department
//       ? await Department.find({ name: { $in: user.department } })
//       : [];

//     for (const dep of oldDepartments) {
//       if (!newDepartments.some((newDep) => newDep.name === dep.name)) {
//         dep.employees.pull(this._conditions._id);
//         await dep.save();
//       }
//     }

//     for (const dep of newDepartments) {
//       if (user.department && user.department.includes(dep.name)) {
//         console.log('Der Benutzer ist bereits in dieser Abteilung');
//         continue;
//       }
//       dep.employees.addToSet(this._conditions._id);
//       await dep.save();
//     }
//   }
//   next();
// });

// // Checks that when a user is deleted that also matches department.employeeCount,
// // and monitors that the ADMIN cannot delete itself, this with its ID because the name can be changed
// userSchema.pre('findOneAndDelete', async function (next) {
//   // console.log('bin remove');
//   // console.log('this: ' + this);
//   // console.log('this._id: ' + this._id);
//   const user1 = await User.findById(this._conditions._id);
//   //console.log('user1' + user1);
//   const user = await this.findOne();

//   // console.log('user' + user);
//   // console.log('user._id: ' + user._id);

//   const ADMIN_ID = '643c1f042df0321cb8a06a47'; //Id MongoDB

//   if (user._id.toString() === ADMIN_ID) {
//     //console.log('ist ADMIN!!!!!!!!!!!!!!!!!');
//     return next(new AppError('Admin can not be deleted!!!', 400));
//   }

//   //console.log('user1._id: ' + user1._id);
//   const departments = await Department.find({ employees: user._id });
//   //console.log('departments: ' + departments);
//   for (const department of departments) {
//     department.employees.pull(user._id);
//     department.employeesCount = department.employees.length;
//     await department.save();
//   }
//   next();
// });
