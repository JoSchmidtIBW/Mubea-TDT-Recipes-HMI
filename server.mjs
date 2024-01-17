import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import path from 'path'; //__dirname is not defined
import { fileURLToPath } from 'url'; //__dirname is not defined
import fs from 'fs';
import mongoose from 'mongoose';
import app from './app.mjs';

import { parseString } from 'xml2js';

//import { todo } from 'node:test';

// import { fileURLToPath } from 'url';
// import path, { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

const __filename = fileURLToPath(import.meta.url); //__dirname is not defined // funktioniert, auch wenn rot ist
const __dirname = path.dirname(__filename); //__dirname is not defined
//const __filename = fs.realpathSync(process.argv[1]);//funktioniert, ist nicht rot
//const __dirname = path.dirname(__filename);

//import path from 'path';

// import path from 'path'; //__dirname is not defined
// import { fileURLToPath } from 'url'; //__dirname is not defined

// // eslint-disable-next-line no-use-before-define
// const __filename = fileURLToPath(import.meta.url); //__dirname is not defined
// const __dirname = path.dirname(__filename); //__dirname is not defined

var xml = '<root>Hello xml2js!</root>';
parseString(xml, function (err, result) {
  console.dir('XMLresult: ' + result);
  console.dir('JSON.stringify(XMLresult): ' + JSON.stringify(result));

  if (result) {
    console.log('es ist result');
  }
  if (err) {
    console.log('ist errorrr: ' + err);
  }
  const message = result.root;
  console.log('Nachricht:', message);
});

console.log('hello TDT_Mubea :)');

//-------------------------------------------------------------------------------------------------------------------

// // Pfad zur Textdatei
// //const filePath = './dev-data/data/hallo.txt'; //10183037 029.50x4.40-3.45 MTT0106DC013.txt';
// //const filePath = './dev-data/data/10183037 029.50x4.40-3.45 MTT0106DC013.txt';
// const filePath = './dev-data/data/10182331 027.00x4.50-3-60 MTT0201DA009.xml';
// //const filePath =
// //  'C:\\Users\\Schmidtjo\\Work Folders\\Desktop\\GIT\\Mubea-TDT-Recipes-HMI\\dev-data\\data\\hallo.txt';

// // const filePath =
// //   'C:/Users/Schmidtjo/Work Folders/Desktop/GIT/Mubea-TDT-Recipes-HMI/import-dev-data/data/hallo.txt';

// //const filePath = path.join(__dirname, 'import-dev-data', 'data', 'hallo.txt');
// //const filePath = path.join(__dirname, 'import-dev-data', 'data', 'hallo.txt');

// // Asynchronen Lesevorgang der Datei durchführen
// fs.readFile(filePath, 'utf8', (err, data) => {
//   // funktioniert mit .txt oder mit .xml
//   if (err) {
//     console.error('Fehler beim Lesen der Datei:', err);
//     return;
//   }
//   // Inhalt der Datei in der Konsole ausgeben
//   console.log(data);
// });

//-------------------------------------------------------------------------------------------------------------------

//const DB = 'mongodb://127.0.0.1:27017/TDT_MubeaDB';

const DB_CONNECTOR = process.env.DB_CONNECTOR;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DB_URL = `${DB_CONNECTOR}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

try {
  mongoose
    .connect(DB_URL, {
      //DB, ....
      useNewUrlParser: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection succeful!'));
} catch (err) {
  console.log('ERROR DB-Connecting');
  console.log('Bin server.mjs');
}

console.log('hefffllooo');

//-------------------------------------------------------------------------------------------------------------------

// Pfad zur Textdatei
//const filePath = './import-dev-data/data/hallo.txt'; //10183037 029.50x4.40-3.45 MTT0106DC013.txt';
// const filePath =
//   'C:\\Users\\Schmidtjo\\Work Folders\\Desktop\\GIT\\Mubea-TDT-Recipes-HMI\\import-dev-data\\data\\hallo.txt';

// const filePath =
//   'C:/Users/Schmidtjo/Work Folders/Desktop/GIT/Mubea-TDT-Recipes-HMI/import-dev-data/data/hallo.txt';

// const filePath = path.join(__dirname, 'import-dev-data', 'data', 'hallo.txt');
// //const filePath = path.join(__dirname, 'import-dev-data', 'data', 'hallo.txt');

// // Asynchronen Lesevorgang der Datei durchführen
// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Fehler beim Lesen der Datei:', err);
//     return;
//   }
//   // Inhalt der Datei in der Konsole ausgeben
//   console.log(data);
// });

//-------------------------------------------------------------------------------------------------------------------

/* TODO: 
      schauen, ob prettier funktioniert
*/

/* FIXME:
      schauen, fragen, ob es ein login oder ein anmelden default gibt
*/

//todo

const x = 23;
//x = 66;
//x + 2;

// Verbindung zur MongoDB herstellen
// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Überprüfen, ob die Verbindung erfolgreich hergestellt wurde
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Verbindungsfehler:'));
// db.once('open', () => {
//   console.log('Verbindung zur Datenbank hergestellt.');

// //   const User = mongoose.model('User', new mongoose.Schema({
// //     // Definiere das Schema für das User-Dokument hier
// //   }));

// //   User.find({}, (err, users) => {
// //     if (err) {
// //       console.error('Fehler beim Abrufen der Benutzer:', err);
// //     } else {
// //       console.log('Benutzerdaten:');
// //       console.log(users);
// //     }

// });

//const users = await
//console.log(users)

// 4. start server
let PORT = 6554;
//let PORT = process.env.DEV_PORT;
if (process.env.NODE_ENV === 'development') {
  PORT = process.env.DEV_PORT;
} else if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PROD_PORT;
} else {
  PORT = 6554;
}

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port: http://127.0.0.1:${PORT} ...in Browser with cookie(später...), (not https)`,
  ); //http://localhost:${PORT} ...
});

console.log('hallo');

export default app;
