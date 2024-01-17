// To load the database with test-data
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'; //__dirname is not definet
import { fileURLToPath } from 'url'; //__dirname is not definet

// eslint-disable-next-line node/no-missing-import
import User from '../../models/userModel.mjs';
import RecipesTDT_original from '../../models/recipesTDT_original_Model.mjs';
import RecipesTDT_en from '../../models/recipesTDT_en_Model.mjs';
import RecipesTDT_de from '../../models/recipesTDT_de_Model.mjs';
//import MalReport from '../../models/malReportModel.mjs';

//import Machine from '../../models/machineModel.mjs';
//import Department from '../../models/departmentModel.mjs';

import dotenv, { config } from 'dotenv';

//console.log(process.env);
// use this before const DB to check file is accessible

//https://stackoverflow.com/questions/61949483/error-typeerror-cannot-read-property-replace-of-undefined
// eslint-disable-next-line
const __filename = fileURLToPath(import.meta.url); // eslint-disable-line // eslint-disable-line //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

//dotenv.config({ path: './config.env' });

const DB = 'mongodb://127.0.0.1:27017/TDT_MubeaDB';
// const DB = process.env.DATABASE_MONGODB.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_MONGODB_PASSWORD
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succeful!'));

// READ JSON-file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const recipesTDT_original = JSON.parse(
  fs.readFileSync(`${__dirname}/recipesTDT_original.json`, 'utf-8'),
);
const recipesTDT_en = JSON.parse(
  fs.readFileSync(`${__dirname}/recipesTDT_en.json`, 'utf-8'),
);
const recipesTDT_de = JSON.parse(
  fs.readFileSync(`${__dirname}/recipesTDT_de.json`, 'utf-8'),
);
// const malReports = JSON.parse(
//   fs.readFileSync(`${__dirname}/malReports.json`, 'utf-8')
// );
// const machinery = JSON.parse(
//   fs.readFileSync(`${__dirname}/machinery.json`, 'utf-8')
// );
// const departments = JSON.parse(
//   fs.readFileSync(`${__dirname}/departments.json`, 'utf-8')
// );

//IMPORT DATA into Database
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await RecipesTDT_original.create(recipesTDT_original, {
      validateBeforeSave: false,
    });
    await RecipesTDT_en.create(recipesTDT_en, { validateBeforeSave: false });
    await RecipesTDT_de.create(recipesTDT_de, { validateBeforeSave: false });
    // await MalReport.create(malReports, { validateBeforeSave: false });
    // await Machine.create(machinery, { validateBeforeSave: false });
    // await Department.create(departments, { validateBeforeSave: false });

    console.log('Data successfully loaded! Test- Daten');
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all the data / Collection, who are there before
const deleteData = async () => {
  try {
    await User.deleteMany();
    await RecipesTDT_original.deleteMany();
    await RecipesTDT_en.deleteMany();
    await RecipesTDT_de.deleteMany();
    // await MalReport.deleteMany();
    // await Machine.deleteMany();
    // await Department.deleteMany();
    console.log('Data successfully deleted!');
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Because --import in terminal, the third in array --> [2]
if (process.argv[2] === '--import') {
  //run importData()
  importData();
} else if (process.argv[2] === '--delete') {
  //run deleteData
  deleteData();
}

console.log('process.argv: ' + process.argv);

// // to run Database:
// // to fill database with test data:
// // new terminal and input: node .\dev-data\data\import-dev-data.mjs --import
// // to delete the database:
// // new terminal and input: node .\dev-data\data\import-dev-data.mjs --delete
