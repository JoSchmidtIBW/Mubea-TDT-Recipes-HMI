import path from 'path'; //__dirname is not defined
import { fileURLToPath } from 'url'; //__dirname is not defined
import express from 'express';
import morgan from 'morgan';

import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp'; // against pollution in url
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.mjs';
import globalErrorHandler from './controllers/errorController.mjs';

import startRoute from './routes/startRoute.mjs';
import viewRoute from './routes/viewRoutes.mjs';
import recipeRoute from './routes/recipeRoute.mjs';
import userRoute from './routes/userRoute.mjs';

const app = express();

const __filename = fileURLToPath(import.meta.url); //__dirname is not defined
const __dirname = path.dirname(__filename); //__dirname is not defined

// Beginning of the app
app.set('view engine', 'pug');

app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'de'),
  path.join(__dirname, 'views', 'en'),
]);
// slash /views// in path, can be a bug with /\- path
// could also be './views', but this is safer, app.set('views', path.join(__dirname, 'views/pages'));

// GLOBAL MIDDLEWARES

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' })); // for POST, to get data from client (need to be json)
// parse data coming in a urlencoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // When form send data to server, for example ejs method=post input, it also called urlencoded , extended true, to send complex data
// parse data from cookies
app.use(cookieParser());

// after the bod-parser, Security for data
// Data sanitization against NoSQLquery injection

// For example: by postman, login as: // or in compass: {"email": {"$gt": ""}} with filter, with {}
// {
//     "email": {"$gt": ""},
//     "password": "newpassword"
// }
app.use(mongoSanitize()); // Filters out all dollar signs

// Data sanatisation against XSS    cross-site-scripting-Attacks
app.use(xss()); // clean user-input from bad / evil html input

// Prevent parameter pollution, cleanup the querystring
app.use(hpp()); // can have a whitelist app.use(hpp({whitelist: ['name']}))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('Hello from the middleware :)');
  // console.log(JSON.stringify(req.headers));
  // console.log(JSON.stringify(req.cookies));
  next();
});

// DELETE COOKIE
app.get('/delete-cookie', (req, res) => {
  //DELETING username COOKIE
  res.clearCookie('jwtAdministrator');
  res.clearCookie('jwt');
  // REDIRECT TO HOME
  res.redirect('/');
});

// API- Routes
app.use('/', startRoute);
app.use('/api/v1', viewRoute); // has to be the first   Hier sollte nicht /api/v1/ stehen....
app.use('/api/v1/recipes', recipeRoute);
app.use('/api/v1/users', userRoute);

// To give an error message for wrong urls, this must happen under the routes
app.all('*', (req, res, next) => {
  // next(err); // error hand over
  // for all errors, get post put delete --> all 404 for not found
  next(new AppError(`Can's find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

//------------------------------------------------------------ALT---------------------------------------------
// API- Routes

// app.get('/xx', (req, res) => {
//   res.status(200).render('txt_xml_FileUploader', {
//     title: 'fileUploader',
//   });
// });

// app.post('/xx', (req, res) => {
//   const text = req.body.hiddenField;
//   console.log(text); // Dieser Befehl gibt den Text in der Terminalkonsole aus
//   res.send('Daten empfangen');
// });
