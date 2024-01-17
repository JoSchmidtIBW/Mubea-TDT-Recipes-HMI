import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';

import he from 'he';

import { parseString } from 'xml2js';
//import { todo } from 'node:test';

import { dataInXml } from '../utils/dataInXMLTXT.mjs';

import RecipesTDT_de from '../models/recipesTDT_de_Model.mjs';

import {
  getAllRecipesTDT_de,
  createRecipesTDT_de,
  getFindRecipesTDTtoLoad,
} from '../models/services/recipesTDT_de_Service.mjs';

import {
  getTeileNummerDefault,
  getZeichnungsNummerDefault,
  getBeschreibungDefault,
  getAenderungsstandZeichnungDefault,
  getAenderungsstandRezeptDefault,
  getZiehGeschwindigkeitDefault,
  getProfileGekoppeltDefault,
  getMindestGutanteilDefault,
  getRampeReinDefault,
  getRampeRausDefault,
  getDehnungDefault,
  getNegativeToleranzMehrfachlaengeDefault,
  getPositiveToleranzMehrfachlaengeDefault,
  getMindestAnzahlGutprofileDefault,
} from '../models/recipesTDT_de_Model.mjs';

export const getRecipesTDTtoLoad = catchAsync(async (req, res, next) => {
  console.log('bin getRecipesTDTtoLoad im recipesController');

  // const recipesTDTtoLoad = await RecipesTDT_de.find().sort({
  //   'kopfDaten.artikelNummer': 1,
  // });
  const recipesTDTtoLoad = await getFindRecipesTDTtoLoad();
  //console.log(recipesTDT);
  // if (recipesTDT.length === 0) {
  //   recipesTDT = 'Es sind keine Daten gefunden worden';
  // }

  if (!recipesTDTtoLoad) {
    return next(new AppError('No recipesTDT found to load', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      recipesTDTtoLoad: recipesTDTtoLoad,
    },
  });
});

export const getCreateRecipe2_St_2_BSB = catchAsync(async (req, res, next) => {
  console.log('bin getCreateRecipe2_St_2_BSB');
  console.log('req.body: ' + req.body);
  console.log(
    'JSON.stringify(req.body.recipeData): ' +
      JSON.stringify(req.body.recipeData),
  );

  const artikelNummerStr_2_St_2_BSB = req.body.recipeData.artikelNummer;
  console.log('artikelNummerStr: ' + artikelNummerStr_2_St_2_BSB);
  console.log('typeOf artikelNummerStr: ' + typeof artikelNummerStr_2_St_2_BSB);
  const artikelNummerFloat_2_St_2_BSB = parseFloat(artikelNummerStr_2_St_2_BSB);
  console.log(
    'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_2_St_2_BSB,
  );

  const artikelNameFirstStr_2_St_2_BSB = req.body.recipeData.artikelName;

  const ziehGeschwindigkeitStr_2_St_2_BSB =
    req.body.recipeData.ziehGeschwindigkeit;
  console.log(
    'typeOf ziehGeschwindigkeitStr: ' +
      typeof ziehGeschwindigkeitStr_2_St_2_BSB,
  );
  const ziehGeschwindigkeitFloat_2_St_2_BSB = parseFloat(
    ziehGeschwindigkeitStr_2_St_2_BSB,
  );
  console.log(
    'typeOf ziehGeschwindigkeitFloat: ' +
      typeof ziehGeschwindigkeitFloat_2_St_2_BSB,
  );

  const benutzerID_2_St_2_BSB = req.body.recipeData.benutzerID;
  console.log('benutzerID:' + benutzerID_2_St_2_BSB);
  const benutzerVorName_2_St_2_BSB = req.body.recipeData.benutzerVorName;
  const benutzerNachName_2_St_2_BSB = req.body.recipeData.benutzerNachName;

  console.log('**************************************');

  const rohrAussenDurchmesserLetzterZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserLetzterZug,
  );

  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );
  console.log(
    'typeOf rohrAussenDurchmesserLetzterZug: ' +
      typeof rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );
  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );

  const rohrWandDickeAussenDurchmesserLetzterZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug,
  );
  const rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet,
  );
  const rohrAussenDurchmesserTDTZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserTDTZug,
  );
  const angel_2_St_2_BSB = parseFloat(req.body.recipeData.angel);
  const dornDurchmesserErsteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornDurchmesserErsteStufe,
  );
  const dornPositionErsteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornPositionErsteStufe,
  );
  const dornDurchmesserZweiteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornDurchmesserZweiteStufe,
  );
  const dornPositionZweiteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornPositionZweiteStufe,
  );
  const fixlaenge_2_St_2_BSB = parseFloat(req.body.recipeData.fixlaenge);
  const ausgleichstueck_2_St_2_BSB = parseFloat(
    req.body.recipeData.ausgleichstueck,
  );
  const mehrfachlaenge_2_St_2_BSB = parseFloat(
    req.body.recipeData.mehrfachlaenge,
  );
  const anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB = parseFloat(
    req.body.recipeData.anzahlFixlaengenProMehrfachlaenge,
  );
  const mindestGutanteil_2_St_2_BSB = parseFloat(
    req.body.recipeData.mindestGutanteil,
  );
  const profileGekoppelt_2_St_2_BSB = parseFloat(
    req.body.recipeData.profileGekoppelt,
  );
  const obereToleranz_2_St_2_BSB = parseFloat(
    req.body.recipeData.obereToleranz,
  );
  const untereToleranz_2_St_2_BSB = parseFloat(
    req.body.recipeData.untereToleranz,
  );
  const wanddickeEcke0_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke0,
  );
  const positionEcke0_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke0,
  );
  const wanddickeEcke1_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke1,
  );
  const positionEcke1_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke1,
  );
  const wanddickeEcke2_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke2,
  );
  const positionEcke2_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke2,
  );
  const wanddickeEcke3_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke3,
  );
  const positionEcke3_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke3,
  );
  const wanddickeEcke3Zwischen4_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke3Zwischen4,
  );
  const positionEcke3Zwischen4_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke3Zwischen4,
  );
  const wanddickeEcke4_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke4,
  );
  const positionEcke4_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke4,
  );
  const wanddickeEckeEnde_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEckeEnde,
  );
  const positionEckeEnde_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEckeEnde,
  );

  // const ecke2_St_2_BSB_e0 = { x: positionEcke0, z: wanddickeEcke0 };
  // const ecke2_St_2_BSB_e1 = { x: positionEcke1, z: wanddickeEcke1 };
  // const ecke2_St_2_BSB_e2 = { x: positionEcke2, z: wanddickeEcke2 };
  // const ecke2_St_2_BSB_e3 = { x: positionEcke3, z: wanddickeEcke3 };
  // const ecke2_St_2_BSB_e34 = { x: positionEcke3Zwischen4, z: wanddickeEcke3Zwischen4 };
  // const ecke2_St_2_BSB_e4 = { x: positionEcke4, z: wanddickeEcke4 };
  // const ecke2_St_2_BSB_eEnde = { x: positionEckeEnde, z: wanddickeEckeEnde };

  // const ecken2_St_2_BSB_Arr = [];
  const ecke2_St_2_BSB_e0 = {
    ecke: 1,
    x: positionEcke0_2_St_2_BSB,
    z: wanddickeEcke0_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e1 = {
    ecke: 2,
    x: positionEcke1_2_St_2_BSB,
    z: wanddickeEcke1_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e2 = {
    ecke: 3,
    x: positionEcke2_2_St_2_BSB,
    z: wanddickeEcke2_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e3 = {
    ecke: 4,
    x: positionEcke3_2_St_2_BSB,
    z: wanddickeEcke3_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e34 = {
    ecke: 5,
    x: positionEcke3Zwischen4_2_St_2_BSB,
    z: wanddickeEcke3Zwischen4_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e4 = {
    ecke: 6,
    x: positionEcke4_2_St_2_BSB,
    z: wanddickeEcke4_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_eEnde = {
    ecke: 7,
    x: positionEckeEnde_2_St_2_BSB,
    z: wanddickeEckeEnde_2_St_2_BSB,
  };

  const eckenArr_2_St_2_BSB = [
    ecke2_St_2_BSB_e0,
    ecke2_St_2_BSB_e1,
    ecke2_St_2_BSB_e2,
    ecke2_St_2_BSB_e3,
    ecke2_St_2_BSB_e34,
    ecke2_St_2_BSB_e4,
    ecke2_St_2_BSB_eEnde,
  ];

  console.log('-----------------------1-----------------------');
  const kommentarArr_2_St_2_BSB = [];
  let erstelltAm_2_St_2_BSB = ''; //: dateObject.toISOString(),
  let createdBy_2_St_2_BSB = benutzerID_2_St_2_BSB; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
  let kommentarBeschreibung_2_St_2_BSB = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

  const dateObject_2_St_2_BSB = new Date();
  //   `${year}-${month}-${day}T00:00:00.000Z`,
  // );
  console.log(dateObject_2_St_2_BSB.toISOString());
  erstelltAm_2_St_2_BSB = dateObject_2_St_2_BSB.toISOString();

  console.log('-----------------------2-----------------------');
  kommentarArr_2_St_2_BSB.push({
    erstelltAm: erstelltAm_2_St_2_BSB,
    createdBy: createdBy_2_St_2_BSB,
    kommentarBeschreibung: kommentarBeschreibung_2_St_2_BSB,
  });

  console.log('-----------------------3-----------------------');
  const stufe1Obj_2_St_2_BSB = {
    dornDurchmesser: dornDurchmesserErsteStufe_2_St_2_BSB,
    position: dornPositionErsteStufe_2_St_2_BSB,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };
  const stufe2Obj_2_St_2_BSB = {
    dornDurchmesser: dornDurchmesserZweiteStufe_2_St_2_BSB,
    position: dornPositionZweiteStufe_2_St_2_BSB,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };

  const stufenArray_2_St_2_BSB = [stufe1Obj_2_St_2_BSB, stufe2Obj_2_St_2_BSB];
  //TODO: Artikelname richtig abspeichern in DB
  console.log(
    '-----------------------------ArtikelName erstellen--------------------------',
  );
  console.log(
    'artikelNameFirstStr_2_St_2_BSB: ' + artikelNameFirstStr_2_St_2_BSB,
  );
  let artikelName_2_St_2_BSB = '';
  // const ziehGeschwindigkeitLastStr_2_St_2_BSB = toString(
  //   ziehGeschwindigkeitFloat_2_St_2_BSB,
  // );
  const ziehGeschwindigkeitLastStr_2_St_2_BSB =
    ziehGeschwindigkeitFloat_2_St_2_BSB.toString();
  console.log(
    'ziehGeschwindigkeitLastStr_2_St_2_BSB: ' +
      ziehGeschwindigkeitLastStr_2_St_2_BSB,
  );
  //const fixlaengeStr_2_St_2_BSB = toString(fixlaenge_2_St_2_BSB);
  const fixlaengeStr_2_St_2_BSB = fixlaenge_2_St_2_BSB.toString();
  console.log('fixlaengeStr_2_St_2_BSB: ' + fixlaengeStr_2_St_2_BSB);

  artikelName_2_St_2_BSB =
    artikelNameFirstStr_2_St_2_BSB +
    ' - ' +
    fixlaengeStr_2_St_2_BSB +
    'mm - ' +
    ziehGeschwindigkeitLastStr_2_St_2_BSB +
    'm/min -';

  console.log('-----------------------4-----------------------');

  const data_2_St_2_BSB = {
    artikelNummer: artikelNummerFloat_2_St_2_BSB,
    artikelName: artikelName_2_St_2_BSB,
    teileNummer: getTeileNummerDefault(),
    zeichnungsNummer: getZeichnungsNummerDefault(),
    aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
    aenderungsstandRezept: getAenderungsstandRezeptDefault(),
    beschreibung: getBeschreibungDefault(),
    ziehGeschwindigkeit: ziehGeschwindigkeitFloat_2_St_2_BSB,
    kommentar: kommentarArr_2_St_2_BSB,

    rohrAussenDurchmesserLetzterZug: rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
    rohrInnenDurchmesserLetzterZug:
      rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB,
    angel: angel_2_St_2_BSB,
    rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_2_St_2_BSB,

    dornStufe: stufenArray_2_St_2_BSB,

    fixLaenge: fixlaenge_2_St_2_BSB,
    ausgleichsstueck: ausgleichstueck_2_St_2_BSB,
    mehrfachLaenge: mehrfachlaenge_2_St_2_BSB,
    anzahlFixLaengenProMehrfachLaenge:
      anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB,
    negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
    posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
    mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

    obereToleranz: obereToleranz_2_St_2_BSB,
    untereToleranz: untereToleranz_2_St_2_BSB,

    mindestGutanteil: mindestGutanteil_2_St_2_BSB,
    profileGekoppelt: profileGekoppelt_2_St_2_BSB,

    ecke: eckenArr_2_St_2_BSB,
  };
  console.log('-----------------------5-----------------------');
  const newRecipes_2_St_2_BSB = await createRecipesTDT_de(data_2_St_2_BSB);
  console.log('newRecipes_2_St_2_BSB: ' + newRecipes_2_St_2_BSB);
  if (!newRecipes_2_St_2_BSB) {
    // Null is false
    return next(new AppError('No recipe_2_St_2_BSB write in db! :(', 404));
  }

  res.status(201).json({
    // 201 = created
    status: 'success',
    message: 'Recipe_2_St_2_BSB succefully created!',
  });
});

//TODO: schauen wegen Default- Werten
export const getConvertOldRecipesToMongoDB = catchAsync(
  async (req, res, next) => {
    console.log('bin getConvertOldRecipesToMongoDB');

    //console.log('req.body: ' + req.body);
    let importOldRecipes = req.body.importOldRecipes;

    let oldRecipesArr = JSON.parse(importOldRecipes);

    let recipeFileNumber = 0;
    for (let i = 0; i < oldRecipesArr.length; i++) {
      console.log('fileName[i]: ' + oldRecipesArr[i].fileName);
      //console.log('fileText[i]: ' + oldRecipesArr[i].fileText);
      if (/^\d{8}\s/.test(oldRecipesArr[i].fileName)) {
        console.log(
          'Der File-Name beginnt mit 8 Zahlen gefolgt von einem Leerzeichen.',
        );
      } else {
        console.log('Der File-Name entspricht nicht dem gesuchten Muster.');
        return next(new AppError('File-Name is wrong. Please try again.', 400)); // 400 = bad request
      }
      recipeFileNumber++;

      //   let irgendwas = 0;
      //   for (let j = 0; j < oldRecipesArr[i].fileText.length; j++) {
      //     irgendwas = j;
      //   }
      //   console.log('irgendwas: ' + irgendwas);
      let xmlData = oldRecipesArr[i].fileText;
      xmlData = decodeURIComponent(xmlData).trim();
      xmlData = he.decode(xmlData);
      //console.log('xmlData: ' + xmlData);
      //const xmlData = '<root>Hello xml2js!</root>';
      try {
        const resultXML = await dataInXml(xmlData);
        console.log('Erfolgreich geparste XML-Daten:', resultXML);
        //console.log('resultXML.name:', resultXML.name);
        //console.log('resultXML.rezept.name:', resultXML.rezept.name);

        let artikelnummerOLD = resultXML.rezept.artikelnummer;
        artikelnummerOLD = String(artikelnummerOLD);
        artikelnummerOLD = parseInt(artikelnummerOLD.replace(/\D/g, ''), 10);

        //const artikelnameOLD = resultXML.rezept.artikelname;
        const artikelnameOLD = Array.isArray(resultXML.rezept.artikelname)
          ? resultXML.rezept.artikelname[0]
          : resultXML.rezept.artikelname;
        const teilenummerOLD = Array.isArray(resultXML.rezept.teilenummer)
          ? resultXML.rezept.teilenummer[0]
          : resultXML.rezept.teilenummer;
        const zeichnungsnummerOLD = Array.isArray(
          resultXML.rezept.zeichnungsnummer,
        )
          ? resultXML.rezept.zeichnungsnummer[0]
          : resultXML.rezept.zeichnungsnummer;

        const aenderungsstandzeichnungOLD = resultXML.rezept[
          'aenderungsstand-zeichnung'
        ]
          ? parseInt(resultXML.rezept['aenderungsstand-zeichnung'][0], 10) !==
            ''
          : getAenderungsstandZeichnungDefault();

        const aenderungsstandrezeptOLD = resultXML.rezept[
          'aenderungsstand-rezept'
        ]
          ? parseInt(resultXML.rezept['aenderungsstand-rezept'][0], 10) !== ''
          : getAenderungsstandRezeptDefault();

        const beschreibungOLD = Array.isArray(resultXML.rezept.beschreibung)
          ? resultXML.rezept.beschreibung[0]
          : resultXML.rezept.beschreibung;

        let ziehgeschwindigkeitOLD = '';
        //let kommentarOLD = Array.isArray(resultXML.rezept.kommentar)[0];

        // //const davOLD = resultXML.rezept.dorn.dav;
        // //const davOLD = resultXML.rezept.dorn[0].dav[0];
        const davOLD = resultXML.rezept.dorn[0].dav[0];
        const divOLD = resultXML.rezept.dorn[0].div[0];
        const angelOLD = resultXML.rezept.dorn[0].angel[0];
        const danOLD = resultXML.rezept.dorn[0].dan[0];

        const stufenOLD = resultXML.rezept.dorn[0].stufen;
        console.log(
          'JSON.stringify(stufenOLD): ' + JSON.stringify(stufenOLD[0]),
        );

        const stufenArray = stufenOLD[0].stufe.map((stufe, index) => ({
          //stufe: index + 1,
          dornDurchmesser: stufe.d[0],
          position: stufe.pos[0],
          rampeRein: stufe['rampe-rein'][0],
          rampeRaus: stufe['rampe-raus'][0],
          dehnung: stufe.dehnung[0],
        }));

        const fixlaengeOLD = resultXML.rezept.mehrfachlaenge[0].fixlaenge[0];
        const ausgleichsstueckOLD =
          resultXML.rezept.mehrfachlaenge[0].ausgleichsstueck[0];
        const mehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0].mehrfachlaenge[0];
        const anzahlfixlaengenpromehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0][
            'anzahl-fixlaengen-pro-mehrfachlaenge'
          ][0];
        const negtolmehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0]['neg-tol-mehrfachlaenge'][0];
        const postolmehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0]['pos-tol-mehrfachlaenge'][0];
        const mindestanzahlgutprofileOLD =
          resultXML.rezept.mehrfachlaenge[0]['mindestanzahl-gutprofile'][0];

        const oberetoleranzOLD =
          resultXML.rezept.standardwerte[0]['obere-toleranz'][0];
        const unteretoleranzOLD =
          resultXML.rezept.standardwerte[0]['untere-toleranz'][0];

        // //--------------------mindes-gutanteil----------------------------------
        // seperat oder in standartwerte
        console.log('komme hier her1');
        const mindestgutanteilOLDstandart =
          resultXML.rezept.standardwerte[0]['mindest-gutanteil'][0];
        console.log(
          'mindestgutanteilOLDstandart: ' + mindestgutanteilOLDstandart,
        );
        console.log('komme hier her');
        let mindestgutanteilOLDout = '';
        if (
          resultXML.rezept['mindest-gutanteil'] &&
          resultXML.rezept['mindest-gutanteil'].length > 0
        ) {
          // Überprüfen, ob der erste Eintrag in 'mindest-gutanteil' definiert ist
          if (mindestgutanteilOLDout === undefined) {
            mindestgutanteilOLDout = 0;
          } else {
            mindestgutanteilOLDout = resultXML.rezept['mindest-gutanteil'][0];
          }
        } else {
          // 'mindest-gutanteil' ist im XML nicht vorhanden
          console.log('mindest-gutanteil ist im XML nicht vorhanden');
          mindestgutanteilOLDout = 0;
        }
        // console.log('mindestgutanteilOLDout: ' + mindestgutanteilOLDout);
        // if (mindestgutanteilOLDout.length === 0) {
        //   mindestgutanteilOLDout = isNaN;
        // }
        //const profilegekoppelOLD = resultXML.rezept['profile-gekoppelt'][0];
        const profilegekoppelOLD = resultXML.rezept['profile-gekoppelt']
          ? parseInt(resultXML.rezept['profile-gekoppelt'][0], 10) !== ''
          : getProfileGekoppeltDefault();

        // //----------------------------------------------------------------------

        const eckenlisteOLD = resultXML.rezept.eckenliste;
        console.log(
          'JSON.stringify(eckenlisteOLD): ' + JSON.stringify(eckenlisteOLD),
        );

        //const stufenArray = stufenOLD[0].stufe.map((stufe, index) => ({
        const eckenArray = eckenlisteOLD[0].ecke.map((ecke, index) => ({
          ecke: index + 1,
          x: ecke.x[0],
          z: ecke.z[0],
        }));

        //---------console.log()--------------------------------------------------------------------------------------

        // console.log('----------------------');
        // console.log('Stufen im Array:', stufenArray);
        // console.log('----------------------');

        // console.log('artikelnummerOLD: ' + artikelnummerOLD);
        console.log('artikelnameOLD: ' + artikelnameOLD);
        // console.log('teilenummerOLD: ' + teilenummerOLD);
        // console.log('zeichnungsnummerOLD: ' + zeichnungsnummerOLD);
        // console.log(
        //   'aenderungsstandzeichnungOLD: ' + aenderungsstandzeichnungOLD,
        // );
        // console.log('aenderungsstandrezeptOLD: ' + aenderungsstandrezeptOLD);
        // console.log('beschreibungOLD: ' + beschreibungOLD);

        // console.log('ziehgeschwindigkeitOLD: ' + ziehgeschwindigkeitOLD);

        // Regulärer Ausdruck, um die Zahl vor "m/min" zu extrahieren
        const artikelNameZiehgeschwindigkeitMatch =
          artikelnameOLD.match(/(\d+)m\/min/);

        ziehgeschwindigkeitOLD = artikelNameZiehgeschwindigkeitMatch
          ? parseInt(artikelNameZiehgeschwindigkeitMatch[1], 10)
          : null;
        console.log('ziehgeschwindigkeitOLD:', ziehgeschwindigkeitOLD);

        //console.log('kommentarOLD: ' + kommentarOLD);

        // console.log('davOLD: ' + davOLD);
        // console.log('divOLD: ' + divOLD);
        // console.log('angelOLD: ' + angelOLD);
        // console.log('danOLD: ' + danOLD);

        // stufenArray.forEach((stufe) => {
        //   //console.log(`Stufe: ${stufe.stufe}`);
        //   console.log(`dornDurchmesser: ${stufe.dornDurchmesser}`);
        //   console.log(`Position: ${stufe.position}`);
        //   console.log(`Rampe Rein: ${stufe.rampeRein}`);
        //   console.log(`Rampe Raus: ${stufe.rampeRaus}`);
        //   console.log(`Dehnung: ${stufe.dehnung}`);
        // });

        // console.log('Stufen im Array:', stufenArray);

        // console.log('fixlaengeOLD: ' + fixlaengeOLD);
        // console.log('ausgleichsstueckOLD: ' + ausgleichsstueckOLD);
        // console.log('mehrfachlaengeOLD: ' + mehrfachlaengeOLD);
        // console.log(
        //   'anzahlfixlaengenpromehrfachlaengeOLD: ' +
        //     anzahlfixlaengenpromehrfachlaengeOLD,
        // );

        // console.log('negtolmehrfachlaengeOLD: ' + negtolmehrfachlaengeOLD);
        // console.log('postolmehrfachlaengeOLD: ' + postolmehrfachlaengeOLD);
        // console.log(
        //   'mindestanzahlgutprofileOLD: ' + mindestanzahlgutprofileOLD,
        // );

        // console.log('oberetoleranzOLD: ' + oberetoleranzOLD);
        // console.log('unteretoleranzOLD: ' + unteretoleranzOLD);

        console.log(
          'mindestgutanteilOLDstandart: ' + mindestgutanteilOLDstandart,
        );
        console.log('mindestgutanteilOLDout: ' + mindestgutanteilOLDout);
        console.log('profilegekoppelOLD: ' + profilegekoppelOLD);

        console.log('----------------------');
        console.log('Ecken im Array:', eckenArray);
        console.log('----------------------');

        eckenArray.forEach((ecke) => {
          console.log(`Ecke: ${ecke.ecke}`);
          console.log(`x: ${ecke.x}`);
          console.log(`z: ${ecke.z}`);
        });

        // aenderungsstandzeichnungOLD = String(aenderungsstandzeichnungOLD);
        // aenderungsstandzeichnungOLD = parseInt(
        //   aenderungsstandzeichnungOLD.replace(/\D/g, ''),
        //   10,
        // );

        // aenderungsstandzeichnungOLD =
        //   isNaN(aenderungsstandzeichnungOLD) ||
        //   aenderungsstandzeichnungOLD === null
        //     ? 1
        //     : aenderungsstandzeichnungOLD;

        // console.log('artikelnameOLD: ' + artikelnameOLD);
        // console.log(
        //   'getAenderungsstandZeichnungDefault(): ' +
        //     getAenderungsstandZeichnungDefault(),
        // );
        //const kommentarOLD =
        //  '\r\n\tErstellt am 27.09.2021 JOS. Ein weiterer Satz.\r\n    ';

        let mindestGutanteilOLD = 0;

        if (
          isNaN(mindestgutanteilOLDout) &&
          !isNaN(mindestgutanteilOLDstandart)
        ) {
          mindestGutanteilOLD = mindestgutanteilOLDstandart;
        } else if (
          isNaN(mindestgutanteilOLDstandart) &&
          !isNaN(mindestgutanteilOLDout)
        ) {
          mindestGutanteilOLD = mindestgutanteilOLDout;
        } else {
          mindestGutanteilOLD = getMindestGutanteilDefault();
        }

        console.log(
          '1111111111111111111111111111111111111111111111111111111111',
        );

        // if (match1) {
        //   while ((match1 = regex.exec(kommentarString)) !== null) {
        //     let worteOderSaetze = match1[1].trim();
        //     let erstelltAmDatum = match1[2];
        //     let kurzerName = match1[3];

        //     console.log('Worte oder Sätze:', worteOderSaetze);
        //     console.log('Datum:', erstelltAmDatum);
        //     console.log('Kurzname:', kurzerName);

        //     const [day, month, year] = erstelltAmDatum.split('.');
        //     const dateObject = new Date(
        //       `${year}-${month}-${day}T00:00:00.000Z`,
        //     );
        //     console.log(dateObject.toISOString());

        //     console.log('---');

        //     kommentarArr.push({
        //       erstelltAm: dateObject.toISOString() || '',
        //       benutzer: kurzerName || '',
        //       kommentarBeschreibung: worteOderSaetze.trim(),
        //       // benutzer: JSON.stringify(kurzerName),
        //       // kommentarBeschreibung: JSON.stringify(worteOderSaetze.trim()),
        //     });
        //   }
        //   kommentarOLD = kommentarArr;
        // } else {
        //   console.log('Kein Kommentar gefunden.');

        //   kommentarOLD = [{ kommentarBeschreibung: kommentarOLD.toString() }];
        // }

        //console.log('kommentarOLD: ' + kommentarOLD);
        // kommentarArr.forEach((kommentar) => {
        //   console.log(`kommentar: ${JSON.stringify(kommentar)}`); // [object object]
        //   console.log('Erstellt am:', kommentar.erstelltAm);
        //   console.log('Kurzname:', kommentar.benutzer);
        //   console.log('Worte:', kommentar.kommentarBeschreibung);
        // });
        // console.log('kommentarArr: ' + kommentarArr);
        console.log('++++++++++++++++++++++++');
        //let kommentarOLD = resultXML.rezept.kommentar[0];//Array.isArray(resultXML.rezept.beschreibung)
        // let kommentarOLD = Array.isArray(resultXML.rezept.kommentar);
        // console.log('kommentarOLD: ' + kommentarOLD);
        // console.log('kommentarOLD.toString(): ' + kommentarOLD.toString());
        let kommentarOLD = Array.isArray(resultXML.rezept.kommentar)
          ? resultXML.rezept.kommentar[0]
              .split('\r\n')
              .map((line) => line.trim())
              .filter((line) => line !== '')
          : [];
        console.log('kommentarOLD:', kommentarOLD);
        console.log('++++++++++++++++++++++++');

        const multiLineString = `Erste Zeile
        Zweite Zeile
        Dritte Zeile
        Vierte Zeile`;

        const lines = multiLineString.split('\n');
        console.log(lines);
        console.log('lines: ' + lines);

        for (let i = 0; i < lines.length; i++) {
          console.log(`Zeile ${i + 1}: ${lines[i].trim()}`);
        }

        //let kommentarString = kommentarOLD.toString();
        //console.log('kommentarString: ' + kommentarString);

        //const kommentarZeilenArr = kommentarString.split('\n');
        // console.log('kommentarZeilen' + kommentarZeilenArr);
        // console.log('************----------******');
        // console.log(
        //   'kommentarZeilen.toString()' + kommentarZeilenArr.toString(),
        // );

        console.log('*****************************');
        console.log('kommentarOLD: ' + kommentarOLD);

        let kommentarArr = [];
        let zeile = '';

        for (let i = 0; i < kommentarOLD.length; i++) {
          zeile = kommentarOLD[i].trim();
          console.log('zeile-i: ' + zeile);

          if (zeile !== '') {
            //const regex = /^(.*?)(\d{2}\.\d{2}\.\d{4}) (\w+)$/gm;
            const regex = /^(.*?) (\d{2}\.\d{2}\.\d{4}) (\w+)$/gm;
            //const regex = /^(.*?) (\d{2}\.\d{2}\.\d{4}) (\w+)$/gm;
            //let match1 = zeile.match(regex);
            let match1 = regex.exec(zeile);
            console.log('match1-i: ' + match1);
            if (match1) {
              console.log('bin im if..');
              let worteOderSaetze = match1[1];
              let erstelltAmDatum = match1[2];
              let kurzerName = match1[3];

              console.log('Worte oder Sätze:', worteOderSaetze);
              console.log('Datum:', erstelltAmDatum);
              console.log('Kurzname:', kurzerName);

              if (kurzerName === 'JOS') {
                kurzerName = '643c1f042df0321cb8a06a47';
              } else if (kurzerName === 'MAT') {
                kurzerName = '643c1f042df0321cb8a06a51';
              } else if (kurzerName === 'SAD') {
                kurzerName = '643c1f042df0321cb8a06a52';
              } else if (kurzerName === 'JAG') {
                kurzerName = '643c1f042df0321cb8a06a53';
              } else if (kurzerName === 'KAE') {
                kurzerName = '643c1f042df0321cb8a06a70';
              } else {
                kurzerName = '643c1f042df0321cb8a06a50';
              }
              console.log('Kurzname_ID:', kurzerName);

              const [day, month, year] = erstelltAmDatum.split('.');
              const dateObject = new Date(
                `${year}-${month}-${day}T00:00:00.000Z`,
              );
              console.log(dateObject.toISOString());

              console.log('---');
              if (
                worteOderSaetze === '' ||
                erstelltAmDatum === '' ||
                kurzerName === ''
              ) {
                kommentarBeschreibung: zeile.trim();
              } else {
                kommentarArr.push({
                  erstelltAm: dateObject.toISOString(),
                  createdBy: kurzerName,
                  kommentarBeschreibung: worteOderSaetze.trim(),
                  // benutzer: JSON.stringify(kurzerName),
                  // kommentarBeschreibung: JSON.stringify(worteOderSaetze.trim()),
                });
              }
            } else {
              console.log('Kein Kommentar oder keine Regel gefunden.');
              kommentarArr.push({
                //erstelltAm: '',
                //benutzer: '',
                createdBy: '643c1f042df0321cb8a06a50',
                kommentarBeschreibung: zeile.trim(),
              });

              // kommentarOLD = [
              //   { kommentarBeschreibung: kommentarOLD.toString() },
              // ];
            }
          }
        }
        kommentarOLD = kommentarArr;

        console.log('*****************************');

        console.log('kommentarOLD: ' + kommentarOLD);
        kommentarArr.forEach((kommentar) => {
          console.log(`kommentar: ${JSON.stringify(kommentar)}`); // [object object]

          console.log('Erstellt am:', kommentar.erstelltAm);
          console.log('createdBy:', kommentar.createdBy);
          console.log('Worte:', kommentar.kommentarBeschreibung);
        });
        console.log('kommentarArr: ' + kommentarArr);
        console.log('*****************************');

        const data = {
          artikelNummer: artikelnummerOLD,
          artikelName: artikelnameOLD,
          teileNummer: teilenummerOLD,
          zeichnungsNummer: zeichnungsnummerOLD,
          aenderungsstandZeichnung: aenderungsstandzeichnungOLD,
          aenderungsstandRezept: aenderungsstandrezeptOLD,
          beschreibung: beschreibungOLD,
          ziehGeschwindigkeit: ziehgeschwindigkeitOLD,
          kommentar: kommentarOLD,

          rohrAussenDurchmesserLetzterZug: davOLD,
          rohrInnenDurchmesserLetzterZug: divOLD,
          angel: angelOLD,
          rohrAussenDurchmesserTDTZug: danOLD,
          //kommentarOLD
          dornStufe: stufenArray,

          fixLaenge: fixlaengeOLD,
          ausgleichsstueck: ausgleichsstueckOLD,
          mehrfachLaenge: mehrfachlaengeOLD,
          anzahlFixLaengenProMehrfachLaenge:
            anzahlfixlaengenpromehrfachlaengeOLD,
          negTolMehrfachLaenge: negtolmehrfachlaengeOLD,
          posTolMehrfachLaenge: postolmehrfachlaengeOLD,
          mindestAnzahlGutProfile: mindestanzahlgutprofileOLD,

          obereToleranz: oberetoleranzOLD,
          untereToleranz: unteretoleranzOLD,

          mindestGutanteil: mindestGutanteilOLD,
          profileGekoppelt: profilegekoppelOLD,

          ecke: eckenArray,
        };

        const newRecipes = await createRecipesTDT_de(data);
        console.log('newRecipes: ' + newRecipes);
        if (!newRecipes) {
          // Null is false
          return next(new AppError('No recipes write in db! :(', 404));
        }
      } catch (error) {
        console.error('Fehler beim Parsen der XML-Daten:', error);
        return next(new AppError(error.message, 400));
      }
    }

    console.log('recipeFileNumber: ' + recipeFileNumber);

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipes succefully created!',
    });
  },
);

//TODO: diese Funktion auslagern in UTILS
// function dataInXml(xml) {
//   return new Promise((resolve, reject) => {
//     parseString(xml, function (err, result) {
//       if (err) {
//         console.log('Fehler beim Parsen des XML in dataINXML-function:', err);
//         return reject(err);
//       }
//       if (result) {
//         //console.log('Parsed XML-Daten in dataINXML-function:', result);
//         return resolve(result);
//       }
//     });
//   });
// }

export default getConvertOldRecipesToMongoDB;

//----------------------------------------------------------OLD-----------------------------------------------------------------

// export const getConvertOldRecipesToMongoDB = catchAsync(
//   async (req, res, next) => {
//     console.log('bin getConvertOldRecipesToMongoDB');

//     //console.log('req.body: ' + req.body);
//     const importOldRecipes = req.body.importOldRecipes;

//     const oldRecipesArr = JSON.parse(importOldRecipes);

//     let recipeFileNumber = 0;
//     for (let i = 0; i < oldRecipesArr.length; i++) {
//       console.log('fileName[i]: ' + oldRecipesArr[i].fileName);
//       //console.log('fileText[i]: ' + oldRecipesArr[i].fileText);
//       if (/^\d{8}\s/.test(oldRecipesArr[i].fileName)) {
//         console.log(
//           'Der File-Name beginnt mit 8 Zahlen gefolgt von einem Leerzeichen.',
//         );
//       } else {
//         console.log('Der File-Name entspricht nicht dem gesuchten Muster.');
//         return next(new AppError('File-Name is wrong. Please try again.', 400)); // 400 = bad request
//       }
//       recipeFileNumber++;

//       //   let irgendwas = 0;
//       //   for (let j = 0; j < oldRecipesArr[i].fileText.length; j++) {
//       //     irgendwas = j;
//       //   }
//       //   console.log('irgendwas: ' + irgendwas);
//       let xmlData = oldRecipesArr[i].fileText;
//       //const xmlData = '<root>Hello xml2js!</root>';
//       try {
//         const resultXML = await dataInXml(xmlData);
//         console.log('Erfolgreich geparste XML-Daten:', resultXML);
//         //console.log('resultXML.name:', resultXML.name);
//         //console.log('resultXML.rezept.name:', resultXML.rezept.name);

//         let artikelnummerOLD = resultXML.rezept.artikelnummer;
//         const artikelnameOLD = resultXML.rezept.artikelname;
//         const teilenummerOLD = resultXML.rezept.teilenummer;
//         const zeichnungsnummerOLD = resultXML.rezept.zeichnungsnummer;
//         const aenderungsstandzeichnungOLD =
//           resultXML.rezept['aenderungsstand-zeichnung'];
//         const aenderungsstandrezeptOLD =
//           resultXML.rezept['aenderungsstand-rezept']; //.aenderungsstand - rezept;
//         const beschreibungOLD = resultXML.rezept.beschreibung;

//         const kommentarOLD = resultXML.rezept.kommentar;

//         //const davOLD = resultXML.rezept.dorn.dav;
//         //const davOLD = resultXML.rezept.dorn[0].dav[0];
//         const davOLD = resultXML.rezept.dorn[0].dav;
//         const divOLD = resultXML.rezept.dorn[0].div;
//         const angelOLD = resultXML.rezept.dorn[0].angel;
//         const danOLD = resultXML.rezept.dorn[0].dan;

//         const stufenOLD = resultXML.rezept.dorn[0].stufen;
//         console.log('JSON.stringify(stufenOLD): ' + JSON.stringify(stufenOLD));

//         const stufenArray = stufenOLD[0].stufe.map((stufe, index) => ({
//           stufe: index + 1,
//           d: stufe.d[0],
//           pos: stufe.pos[0],
//           rampeRein: stufe['rampe-rein'][0],
//           rampeRaus: stufe['rampe-raus'][0],
//           dehnung: stufe.dehnung[0],
//         }));

//         const fixlaengeOLD = resultXML.rezept.mehrfachlaenge[0].fixlaenge;
//         const ausgleichsstueckOLD =
//           resultXML.rezept.mehrfachlaenge[0].ausgleichsstueck;
//         const mehrfachlaengeOLD =
//           resultXML.rezept.mehrfachlaenge[0].mehrfachlaenge;
//         const anzahlfixlaengenpromehrfachlaengeOLD =
//           resultXML.rezept.mehrfachlaenge[0][
//             'anzahl-fixlaengen-pro-mehrfachlaenge'
//           ];
//         const negtolmehrfachlaengeOLD =
//           resultXML.rezept.mehrfachlaenge[0]['neg-tol-mehrfachlaenge'];
//         const postolmehrfachlaengeOLD =
//           resultXML.rezept.mehrfachlaenge[0]['pos-tol-mehrfachlaenge'];
//         const mindestanzahlgutprofileOLD =
//           resultXML.rezept.mehrfachlaenge[0]['mindestanzahl-gutprofile'];

//         const oberetoleranzOLD =
//           resultXML.rezept.standardwerte[0]['obere-toleranz'];
//         const unteretoleranzOLD =
//           resultXML.rezept.standardwerte[0]['untere-toleranz'];

//         //--------------------mindes-gutanteil----------------------------------
//         // seperat oder in standartwerte
//         const mindestgutanteilOLDstandart =
//           resultXML.rezept.standardwerte[0]['mindest-gutanteil'];

//         const mindestgutanteilOLDout = resultXML.rezept['mindest-gutanteil'];
//         const profilegekoppelOLD = resultXML.rezept['profile-gekoppelt'];

//         //----------------------------------------------------------------------

//         const eckenlisteOLD = resultXML.rezept.eckenliste;
//         console.log(
//           'JSON.stringify(eckenlisteOLD): ' + JSON.stringify(eckenlisteOLD),
//         );

//         //const stufenArray = stufenOLD[0].stufe.map((stufe, index) => ({
//         const eckenArray = eckenlisteOLD[0].ecke.map((ecke, index) => ({
//           ecke: index + 1,
//           x: ecke.x[0],
//           z: ecke.z[0],
//         }));

//         //---------console.log()--------------------------------------------------------------------------------------

//         console.log('----------------------');
//         console.log('Stufen im Array:', stufenArray);
//         console.log('----------------------');

//         console.log('artikelnummerOLD: ' + artikelnummerOLD);
//         console.log('artikelnameOLD: ' + artikelnameOLD);
//         console.log('teilenummerOLD: ' + teilenummerOLD);
//         console.log('zeichnungsnummerOLD: ' + zeichnungsnummerOLD);
//         console.log(
//           'aenderungsstandzeichnungOLD: ' + aenderungsstandzeichnungOLD,
//         );
//         console.log('aenderungsstandrezeptOLD: ' + aenderungsstandrezeptOLD);
//         console.log('beschreibungOLD: ' + beschreibungOLD);

//         console.log('kommentarOLD: ' + kommentarOLD);

//         console.log('davOLD: ' + davOLD);
//         console.log('divOLD: ' + divOLD);
//         console.log('angelOLD: ' + angelOLD);
//         console.log('danOLD: ' + danOLD);

//         stufenArray.forEach((stufe) => {
//           console.log(`Stufe: ${stufe.stufe}`);
//           console.log(`D: ${stufe.d}`);
//           console.log(`Pos: ${stufe.pos}`);
//           console.log(`Rampe Rein: ${stufe.rampeRein}`);
//           console.log(`Rampe Raus: ${stufe.rampeRaus}`);
//           console.log(`Dehnung: ${stufe.dehnung}`);
//         });

//         console.log('Stufen im Array:', stufenArray);

//         console.log('fixlaengeOLD: ' + fixlaengeOLD);
//         console.log('ausgleichsstueckOLD: ' + ausgleichsstueckOLD);
//         console.log('mehrfachlaengeOLD: ' + mehrfachlaengeOLD);
//         console.log(
//           'anzahlfixlaengenpromehrfachlaengeOLD: ' +
//             anzahlfixlaengenpromehrfachlaengeOLD,
//         );

//         console.log('negtolmehrfachlaengeOLD: ' + negtolmehrfachlaengeOLD);
//         console.log('postolmehrfachlaengeOLD: ' + postolmehrfachlaengeOLD);
//         console.log(
//           'mindestanzahlgutprofileOLD: ' + mindestanzahlgutprofileOLD,
//         );

//         console.log('oberetoleranzOLD: ' + oberetoleranzOLD);
//         console.log('unteretoleranzOLD: ' + unteretoleranzOLD);

//         console.log(
//           'mindestgutanteilOLDstandart: ' + mindestgutanteilOLDstandart,
//         );
//         console.log('mindestgutanteilOLDout: ' + mindestgutanteilOLDout);
//         console.log('profilegekoppelOLD: ' + profilegekoppelOLD);

//         console.log('----------------------');
//         console.log('Ecken im Array:', eckenArray);
//         console.log('----------------------');

//         eckenArray.forEach((ecke) => {
//           console.log(`Ecke: ${ecke.ecke}`);
//           console.log(`x: ${ecke.x}`);
//           console.log(`z: ${ecke.z}`);
//         });

//         console.log('*****************************');
//         //await getAllUsers();
//         //await getAllRecipesTDT_de();
//         console.log('*****************************');

//         //const recipesTDTOLD_data = 'halloijnhpiunhi';
//         // artikelnummerOLD
//         // artikelnameOLD
//         // teilenummerOLD
//         // zeichnungsnummerOLD
//         // aenderungsstandzeichnungOLD
//         // aenderungsstandrezeptOLD
//         // beschreibungOLD
//         // kommentarOLD

//         // davOLD;
//         // divOLD;
//         // angelOLD;
//         // danOLD;

//         // stufenArray;

//         // fixlaengeOLD;
//         // ausgleichsstueckOLD;
//         // mehrfachlaengeOLD;
//         // anzahlfixlaengenpromehrfachlaengeOLD;

//         // negtolmehrfachlaengeOLD;
//         // postolmehrfachlaengeOLD;
//         // mindestanzahlgutprofileOLD;

//         // oberetoleranzOLD;
//         // unteretoleranzOLD;

//         // mindestgutanteilOLDstandart;
//         // mindestgutanteilOLDout;
//         // profilegekoppelOLD;

//         // eckenArray;

//         // let recipesTDTOLD_data = {
//         //   artikelNummerOLDobj: artikelnummerOLD,
//         //   // artikelNameOLDobj: artikelnameOLD,
//         //   // teileNummerOldobj: teilenummerOLD,
//         //   // zeichnungsNummerOLDobj: zeichnungsnummerOLD,
//         //   // aenderungsstandZeichnungOLDobj: aenderungsstandzeichnungOLD,
//         //   // aenderungsstandRezeptOLDobj: aenderungsstandrezeptOLD,
//         //   // beschreibungOLDobj: beschreibungOLD,
//         //   // kommentarOLDobj: kommentarOLD,

//         //   // davOLDobj: davOLD,
//         //   // divOLDobj: divOLD,
//         //   // angelOLDobj: angelOLD,
//         //   // danOLDobj: danOLD,
//         // };
//         // createRecipesTDT_de(recipesTDTOLD_data);
//         artikelnummerOLD = String(artikelnummerOLD);
//         artikelnummerOLD = parseInt(artikelnummerOLD.replace(/\D/g, ''), 10);

//         //const artikelName = Array.isArray(data.artikelNameOld) ? data.artikelNameOld[0] : data.artikelNameOld;

//         //createRecipesTDT_de(artikelnummerOLD);

//         // if (Array.isArray(data.artikelNameOld)) {
//         //   artikelName = data.artikelNameOld[0];
//         // } else {
//         //   artikelName = data.artikelNameOld;
//         // }

//         console.log('*****************************');
//         console.log('artikelnameOLD: ' + artikelnameOLD);
//         console.log('*****************************');

//         const data = {
//           artikelNummer: artikelnummerOLD,
//           artikelName: artikelnameOLD,
//           //artikelName: JSON.stringify(artikelnameOLD),
//           // teileNummer: teilenummerOLD,
//           // zeichnungsNummer: zeichnungsnummerOLD,
//           // aenderungsstandzeichnungOLD,
//           // aenderungsstandrezeptOLD,
//           // beschreibungOLD,
//           //kommentarOLD
//         };

//         console.log('///////////////');
//         console.log('data: ' + JSON.stringify(data));
//         // Aufruf der Funktion mit dem "data"-Objekt
//         await createRecipesTDT_de(data);

//         // const jsonDataXML = JSON.stringify(resultXML, null, 2);
//         // console.log(jsonDataXML);
//         // console.log(jsonDataXML.rezept.name);
//       } catch (error) {
//         console.error('Fehler beim Parsen der XML-Daten:', error);
//       }
//     }

//     console.log('recipeFileNumber: ' + recipeFileNumber);

//     res.status(200).json({
//       status: 'success',
//       message: 'A new user is succefully created!',
//     });
//   },
// );

// for (let i = 0; i < stufenOLD.length; i++) {
//   console.log(
//     'JSON.stringify(stufenOLD[i]): ' + JSON.stringify(stufenOLD[i]),
//   );
// }

// const stufenArray = [];

// for (let i = 0; i < stufenOLD.length; i++) {
//   const stufe = stufenOLD[i].stufe[0];
//   const d = stufenOLD[i].d;
//   //   const pos = stufenOLD[i].pos[0];
//   //   const rampeRein = stufenOLD[i]['rampe-rein'][0];
//   //   const rampeRaus = stufenOLD[i]['rampe-raus'][0];
//   //   const dehnung = stufenOLD[i].dehnung[0];

//   const stufenObj = {
//     stufe,
//     d,
//     // pos,
//     // rampeRein,
//     // rampeRaus,
//     // dehnung,
//   };
//   stufenArray.push(stufenObj);
// }

// for (let i = 0; i < stufenOLD.length; i++) {
//   const stufe = stufenOLD[i];
//   const stufenObj = {
//     //stufe: stufe.stufe[0],
//     d: stufe.d, //[0],
//     // pos: stufe.pos, //[0],
//     // rampeRein: stufe['rampe-rein'], //[0],
//     // rampeRaus: stufe['rampe-raus'], //[0],
//     // dehnung: stufe.dehnung, //[0],
//   };
//   stufenArray.push(stufenObj);
// }

//********************************************************************************** */
// export const getConvertOldRecipesToMongoDB = catchAsync(
//     async (req, res, next) => {
//       console.log('bin getConvertOldRecipesToMongoDB');

//       console.log('req.body: ' + req.body);
//       const importOldRecipes = req.body.importOldRecipes;
//       //console.log('importOldRecipes: ' + importOldRecipes);
//       // console.log(
//       //   'JSON.stringify(importOldRecipes): ' + JSON.stringify(importOldRecipes),
//       // );
//       // console.log(
//       //   'JSON.parse(importOldRecipes): ' + JSON.parse(importOldRecipes),
//       // );

//       const oldRecipesArr = JSON.parse(importOldRecipes);

//       const firstObject = JSON.parse(importOldRecipes)[0]; //parsedData[0]; // Hier greifen Sie auf das erste Objekt im Array zu

//       const firstFileName = firstObject.fileName;
//       const firstFileText = firstObject.fileText;

//       console.log('firstFileName: ' + firstFileName);
//       console.log('firstFileText: ' + firstFileText);

//       let recipeFileNumber = 0;
//       for (let i = 0; i < oldRecipesArr.length; i++) {
//         if (/^\d{8}\s/.test(oldRecipesArr[i].fileName)) {
//           console.log(
//             'Der File-Name beginnt mit 8 Zahlen gefolgt von einem Leerzeichen.',
//           );
//         } else {
//           console.log('Der File-Name entspricht nicht dem gesuchten Muster.');
//           return next(new AppError('File-Name is wrong. Please try again.', 400)); // 400 = bad request
//         }
//         recipeFileNumber++;

//         let irgendwas = 0;
//         for (let j = 0; j < oldRecipesArr[i].fileText.length; j++) {
//           irgendwas = j;
//         }
//         console.log('irgendwas: ' + irgendwas);
//         let xmlData = oldRecipesArr[i].fileText;
//         //const xmlData = '<root>Hello xml2js!</root>';
//         try {
//           const result = await dataInXml(xmlData);
//           console.log('Erfolgreich geparste XML-Daten:', result);
//         } catch (error) {
//           console.error('Fehler beim Parsen der XML-Daten:', error);
//         }
//         //   if(oldRecipesArr[i].fileText)????
//         //   gehe text durch und schaue ob erstes wort mit <rezept> und letztes wort mit <!rezept> aufhört. wie geht das?

//         //   if (/^<rezept>.*<!rezept>$/.test(oldRecipesArr[i].fileText)) {
//         //     console.log('Der Text beginnt mit <rezept> und endet mit <!rezept>.');
//         //   } else {
//         //     console.log('Der Text entspricht nicht dem gesuchten Muster.');
//         //     // Handle error here
//         //   }
//         //-------------------------------------------------------------------------------------
//         //   if (oldRecipesArr[i].fileText)
//         //-------------------------------------------------------------------------------------
//         //   var xml = '<root>Hello xml2js!</root>';
//         //   var xml = oldRecipesArr[i].fileText;
//         //   //parseString(oldRecipesArr[i].fileText);

//         //   parseString(xml, function (err, result) {
//         //     console.log('Bin parseString...');
//         //     //   console.dir('XMLresult: ' + result);
//         //     //   console.dir('JSON.stringify(XMLresult): ' + JSON.stringify(result));

//         //     //   const message = result.root;
//         //     //   console.log('Nachricht:', message);

//         //     if (err) {
//         //       console.log('Bin Error in parceSTring: ' + err);
//         //       return err;
//         //     }
//         //     if (result) {
//         //       console.log('Bin Result in parseString: ' + result);
//         //       return result;
//         //     }
//         //   });
//         //---------------------------------------------------------------------------------------
//       }

//       console.log('recipeFileNumber: ' + recipeFileNumber);

//       //kontrolliert, ob es sich um die richtigen daten handelt.
//       //schickt das ganze ins model um zu speichern

//       // if (year >= yearNow.toString()) {
//       //   return next(
//       //     new AppError('The Birth date can not be real...! Please try again.', 400)
//       //   ); // 400 = bad request
//       // }

//       // const userData = {
//       //   employeeNumber: req.body.employeeNumber,
//       // };

//       // const newUser = new User(userData);
//       // await newUser.save();

//       res.status(200).json({
//         status: 'success',
//         message: 'A new user is succefully created!',
//       });
//     },
//   );
