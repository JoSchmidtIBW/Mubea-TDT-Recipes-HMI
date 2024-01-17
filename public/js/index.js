/* eslint-disable */

import '@babel/polyfill'; // first line of imports, for older browsers
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

import {
  convertOldRecipes,
  showRecipesTDToverviewTable,
  createRecipe2_St_2_BSB,
} from './recipes';

import { showUsers, createNewUser, updateUser, deleteUser } from './user';

// DOM Element
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');

const recipeSendForm = document.querySelector('.form--recipeSend');

const manageUsersTable = document.querySelector('.manageUsersTable');
const newUserDataForm = document.querySelector('.form-new-user-data');
const updateUserByAdminDataForm = document.querySelector(
  '.form-workerAdmin-data',
);

const createRecipe2_St_2_BSB_DataForm = document.querySelector(
  '.form-createRecipe-2_St_2_BSB-data',
);

const updateRecipeDataForm = document.querySelector('.form-updateRecipe-data');

const dragDropForm = document.querySelector('.form--dragDrop');
const recipesTDToverviewTable = document.querySelector(
  '.recipesTDToverviewTable',
);

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // element prevent from loading the page

    const employeeNumber = document.getElementById('employeeNumber').value;
    const password = document.getElementById('password').value;

    login(employeeNumber, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //also images
    const form = new FormData();
    form.append('firstName', document.getElementById('firstname').value);
    form.append('lastName', document.getElementById('lastname').value);
    form.append('gender', document.getElementById('gender').value);
    form.append('language', document.getElementById('language').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);

    form.append('photo', document.getElementById('photo').files[0]); // files are array, need first element

    // console.log(
    //   'bin if(userDataForm), in index.js, wenn bild, sieht keine information sollte aber kein problem sein: ' +
    //     form,
    // );
    console.log('bin if(userDataForm), FormData Objekt:');
    for (const pair of form.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    //console.log('JSON.stringify(form): ' + JSON.stringify(form));

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...'; // innerHtml or textContent

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    ); // this data must be called exactly the same as in postman!

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    console.log('bin forgotPasswordForm');
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log('email: ' + email);
    forgotPassword(email);
  });
}

if (manageUsersTable) {
  console.log('bin If usertable');
  showUsers();
}

if (newUserDataForm) {
  newUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Bin newUserDataForm');

    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.querySelector('#role').value;
    const selectedDepartments = Array.from(
      document.querySelectorAll('input[name="departments"]:checked'),
    ).map((department) => department.value);

    console.log(employeeNumber);
    console.log(firstname);
    console.log(lastname);
    console.log(birthDate);
    console.log(gender);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);
    console.log(role);

    console.log('-------------------');
    console.log(selectedDepartments);

    const department = selectedDepartments;

    createNewUser(
      employeeNumber,
      firstname,
      lastname,
      birthDate,
      gender,
      language,
      professional,
      email,
      password,
      passwordConfirm,
      role,
      department,
    );
  });
}

const saveUpdateUserByAdminButton = document.querySelector(
  '.btn--saveUpdateUserByAdmin',
);
const deleteUpdateUserByAdminButton = document.querySelector(
  '.btn--deleteUpdateUserByAdmin',
);

if (updateUserByAdminDataForm) {
  updateUserByAdminDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateUserByAdminDataForm');

    const id = document.getElementById('userId').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('#role').value;
    const departmentString = document.querySelector('#department').value;

    console.log(id);
    console.log(employeeNumber);
    console.log(firstName);
    console.log(lastName);
    console.log(birthDate);
    console.log(gender);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(role);

    console.log(departmentString);
    //TODO: CHeck if Array or only String
    const departmentsArray = departmentString.split(',');

    console.log(departmentsArray);
    const department = departmentsArray;
    if (e.submitter === saveUpdateUserByAdminButton) {
      console.log('bin SAVE in updateUserByAdminDataForm');
      updateUser(
        {
          firstName,
          lastName,
          birthDate,
          gender,
          professional,
          email,
          role,
          department,
        },
        id,
      );
    } else if (e.submitter === deleteUpdateUserByAdminButton) {
      console.log('bin Delete in updateUserByAdminDataForm');
      deleteUser(id);
    }
  });
}

const recipeSendButton = document.querySelector('.btn--recipeSend');
const recipeSendStatus = document.getElementById('recipeSendStatus');

if (recipeSendForm) {
  recipeSendButton.addEventListener('click', function (e) {
    console.log('Bin recipeSendForm');
    e.preventDefault();

    const recipeSendDataInput = document.getElementById(
      'recipeToSendRowdataInput',
    );
    const recipeSendData = recipeSendDataInput.value;
    console.log('recipeSendData:', recipeSendData);
    console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));
    const recipeSendDataJSON = JSON.parse(recipeSendData);

    if (recipeSendData.trim() !== '') {
      //console.log('recipeSendData:', recipeSendData);
      //console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));
      recipeSendStatus.textContent = `Rezept gesendet: ${recipeSendDataJSON.artikelNummer} ${recipeSendDataJSON.artikelName}`;
    } else {
      console.log('Inputfeld ist leer.');
    }
  });
}

if (createRecipe2_St_2_BSB_DataForm) {
  createRecipe2_St_2_BSB_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe2_St_2_BSB_DataForm in index.js');
    e.preventDefault();

    const artikelNummer = document.getElementById('artikelNummer').value;
    const artikelName = document.getElementById('artikelName').value;
    const ziehGeschwindigkeit = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;
    const benutzerVorName = document.getElementById('benutzerVorName').value;
    const benutzerNachName = document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug = document.getElementById(
      'rohrAussenDurchmesserLetzterZug',
    ).value;
    const rohrWandDickeAussenDurchmesserLetzterZug = document.getElementById(
      'rohrWandDickeAussenDurchmesserLetzterZug',
    ).value;
    const rohrInnenDurchmesserLetzterZugBerechnet = document.getElementById(
      'rohrInnenDurchmesserLetzterZugBerechnet',
    ).value;
    const rohrAussenDurchmesserTDTZug = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;
    const fixlaenge = document.getElementById('fixlaenge').value;
    const ausgleichstueck = document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge = document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge = document.getElementById(
      'anzahlFixlaengenProMehrfachlaenge',
    ).value;
    const mindestGutanteil = document.getElementById('mindestGutanteil').value;
    const profileGekoppelt = document.getElementById('profileGekoppelt').value;
    const obereToleranz = document.getElementById('obereToleranz').value;
    const untereToleranz = document.getElementById('untereToleranz').value;
    const wanddickeEcke0 = document.getElementById('wanddickeEcke0').value;
    const positionEcke0 = document.getElementById('positionEcke0').value;
    const wanddickeEcke1 = document.getElementById('wanddickeEcke1').value;
    const positionEcke1 = document.getElementById('positionEcke1').value;
    const wanddickeEcke2 = document.getElementById('wanddickeEcke2').value;
    const positionEcke2 = document.getElementById('positionEcke2').value;
    const wanddickeEcke3 = document.getElementById('wanddickeEcke3').value;
    const positionEcke3 = document.getElementById('positionEcke3').value;
    const wanddickeEcke3Zwischen4 = document.getElementById(
      'wanddickeEcke3Zwischen4',
    ).value;
    const positionEcke3Zwischen4 = document.getElementById(
      'positionEcke3Zwischen4',
    ).value;
    const wanddickeEcke4 = document.getElementById('wanddickeEcke4').value;
    const positionEcke4 = document.getElementById('positionEcke4').value;
    const wanddickeEckeEnde =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde = document.getElementById('positionEckeEnde').value;

    const benutzerID = document.getElementById('benutzerID').value;

    // console.log('artikelNummer: ' + artikelNummer);
    // console.log('artikelName: ' + artikelName);

    const data = {
      artikelNummer,
      artikelName,
      ziehGeschwindigkeit,
      benutzerVorName,
      benutzerNachName,
      benutzerID,
      rohrAussenDurchmesserLetzterZug,
      rohrWandDickeAussenDurchmesserLetzterZug,
      rohrInnenDurchmesserLetzterZugBerechnet,
      rohrAussenDurchmesserTDTZug,
      angel,
      dornDurchmesserErsteStufe,
      dornPositionErsteStufe,
      dornDurchmesserZweiteStufe,
      dornPositionZweiteStufe,
      fixlaenge,
      ausgleichstueck,
      mehrfachlaenge,
      anzahlFixlaengenProMehrfachlaenge,
      mindestGutanteil,
      profileGekoppelt,
      obereToleranz,
      untereToleranz,
      wanddickeEcke0,
      positionEcke0,
      wanddickeEcke1,
      positionEcke1,
      wanddickeEcke2,
      positionEcke2,
      wanddickeEcke3,
      positionEcke3,
      wanddickeEcke3Zwischen4,
      positionEcke3Zwischen4,
      wanddickeEcke4,
      positionEcke4,
      wanddickeEckeEnde,
      positionEckeEnde,
    };

    createRecipe2_St_2_BSB(data);
  });
}

const saveUpdateRecipeButton = document.querySelector('.btn--saveUpdateRecipe');
const deleteRecipeButton = document.querySelector('.btn--deleteRecipe');

if (updateRecipeDataForm) {
  console.log('bin updateRecipeDataForm ---1---');
  updateRecipeDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateRecipeDataForm ---2---');

    // const id = document.getElementById('userId').value;
    // const employeeNumber = document.getElementById('employeeNumber').value;
    // const firstName = document.getElementById('firstname').value;
    // const lastName = document.getElementById('lastname').value;
    // const birthDate = document.getElementById('birthDate').value;
    // const gender = document.querySelector('#gender').value;
    // const language = document.querySelector('#language').value;
    // const professional = document.querySelector('#professional').value;
    // const email = document.getElementById('email').value;
    // const role = document.querySelector('#role').value;
    // const departmentString = document.querySelector('#department').value;

    // console.log(id);
    // console.log(employeeNumber);
    // console.log(firstName);
    // console.log(lastName);
    // console.log(birthDate);
    // console.log(gender);
    // console.log(language);
    // console.log(professional);
    // console.log(email);
    // console.log(role);

    // console.log(departmentString);
    // //TODO: CHeck if Array or only String
    // const departmentsArray = departmentString.split(',');

    // console.log(departmentsArray);
    // const department = departmentsArray;
    if (e.submitter === saveUpdateRecipeButton) {
      console.log('bin SAVE in updateRecipeDataForm');
      // updateRecipe(
      //   {
      //     firstName,
      //     lastName,
      //     birthDate,
      //     gender,
      //     professional,
      //     email,
      //     role,
      //     department,
      //   },
      //   id,
      // );
    } else if (e.submitter === deleteRecipeButton) {
      console.log('bin Delete in updateRecipeDataForm');
      //deleteRecipe(id);
    }
  });
}

if (dragDropForm)
  dragDropForm.addEventListener('submit', (e) => {
    e.preventDefault(); // element prevent from loading the page

    console.log('bin dragDropForm in index.js');

    const inputOldRecipes = document.getElementById('hiddenRecipesField').value;
    console.log('inputOldRecipes: ' + inputOldRecipes);

    console.log('JSON.parse(inputOldRecipes): ' + JSON.parse(inputOldRecipes));
    //login(employeeNumber, password);

    let strTest = 'Helllloooooo';

    convertOldRecipes(inputOldRecipes);
  });

if (recipesTDToverviewTable) {
  console.log('bin If recipesTDToverviewTable');
  showRecipesTDToverviewTable();
}
