/* elint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

const dev_Port = 6555;
const prod_Port = 6557;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const createRecipe2_St_2_BSB = async (data) => {
  console.log('bin createRecipe2_St_2_BSB zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe2_St_2_BSB`,
      // data: {
      //   name: name,
      //   description: description,
      // },
      //data: data,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe2_St_2_BSB created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const convertOldRecipes = async (importOldRecipes) => {
  console.log('bin convertOldRecipes in recipes.js zum serverschicken');
  console.log('importOldRecipes: ' + importOldRecipes);

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/convertOldRecipesToMongoDB`,
      data: {
        importOldRecipes: importOldRecipes,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Old-Recipes confert to mongoDB successfully');
      window.setTimeout(() => {
        location.assign(`http://127.0.0.1:6555/api/v1/overviewInlogt`);
        //location.assign(`${strPathApiV1}/`);
      }, 1200);
    } else {
      console.log('not success!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('Etwas ging schief, siehe Fehlermeldung oben');
    window.setTimeout(() => {
      location.assign(`http://127.0.0.1:6555/api/v1/txt_xml_fileuploader`);
      //location.assign(`${strPathApiV1}/`);
    }, 3200);
  }
};

export const showRecipesTDToverviewTable = async () => {
  console.log('bin showRecipesTDToverviewTable');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
    });

    console.log('Response:', res); // Log the gesamte Antwort

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable');

      const recipesArray = res.data.data.recipesTDTtoLoad.map((recipe) => ({
        //const comments = recipe.kopfDaten.kommentar;
        id: recipe._id,
        artikelNummer: recipe.kopfDaten.artikelNummer,
        artikelName: recipe.kopfDaten.artikelName,
        teileNummer: recipe.kopfDaten.teileNummer,
        zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
        aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
        aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
        beschreibung: recipe.kopfDaten.beschreibung,
        ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
        kommentar: JSON.stringify(recipe.kopfDaten.kommentar),

        //comments: recipe.kopfDaten.kommentar,

        // Finde das letzte Datum
        lastCommentDate:
          recipe.kopfDaten.kommentar.length > 0
            ? new Date(
                recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].erstelltAm,
              ).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '',

        // lastCommentUser:
        //   recipe.kopfDaten.kommentar > 0
        //     ? recipe.kopfDaten.kommentar[recipe.kopfDaten.kommentar.length - 1]
        //         .createdBy
        //     : '',
        lastCommentUser:
          recipe.kopfDaten.kommentar.length > 0
            ? recipe.kopfDaten.kommentar[recipe.kopfDaten.kommentar.length - 1]
                .createdBy.firstName
            : '',

        // kommentarLetztesDatum: recipe.kopfDaten.kommentar.map(
        //   (comment) => comment.erstelltAm,
        // ),
        // kommentarLetzterUser:
        mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
        profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
        rohrAussenDurchmesserLetzterZug:
          recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
        rohrInnenDurchmesserLetzterZug:
          recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
        angel: recipe.dornWerte.angel,
        rohrAussenDurchmesserTDTZug:
          recipe.dornWerte.rohrAussenDurchmesserTDTZug,
        dornStufen: recipe.dornWerte.dornStufen,
        mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
        standartWerte: recipe.standartWerte,
        eckenListe: recipe.eckenListe,
        rohrWerte: recipe.rohrWerte,
      }));

      console.log('Recipes Array:', recipesArray);

      $('#recipesTDToverviewTable').empty();

      // DataTable mit benutzerdefinierten Optionen initialisieren
      const dataTable = $('#recipesTDToverviewTable')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 500,
          language: {
            lengthMenu: 'Display _MENU_ records per page', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Showing _START_ to _END_ of _TOTAL_ records', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'No records available',
            infoFiltered: '(filtered from _MAX_ total records)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'First',
              last: 'Last',
              next: 'Next',
              previous: 'Previous',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'All'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Artikelnummer', type: 'numeric' },
            { data: 'artikelName', title: 'Artikelname' },
            { data: 'lastCommentDate', title: 'Letztes Datum' },
            { data: 'lastCommentUser', title: 'Letzter User' },
            {
              data: 'id', //${apiUrl}/manage_users/${data}
              render: function (data) {
                console.log('Value of data:', data);
                return `
                <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
                  <svg class="heading-box__icon">
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
              },
              orderable: false,
            },
          ],
          data: recipesArray,
        })
        .order([1, 'asc'])
        .draw();

      $(document).ready(function () {
        $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
          const rowData = dataTable.row(this).data();

          console.log('rowData bei Klick in Tabelle angewählt:', rowData);
          console.log('rowData.kommentar:', rowData.kommentar);

          const eckenListe = rowData.eckenListe;

          const dynamicContent = generateDynamicContent(rowData);
          $('#rightDiv').html(dynamicContent);

          $('#recipeToSendRowdataInput').val(JSON.stringify(rowData));

          // Canvas für die Eckenliste zeichnen
          const canvas = document.getElementById('eckenCanvas');
          if (!canvas) {
            console.error('Canvas-Element nicht gefunden');
            return;
          }

          const ctx = canvas.getContext('2d');

          const padding = 120; //120;
          const minZXXX = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

          // const minX = Math.max(
          //   minZXXX - 0.5,
          //   Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z)),
          // );
          const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
          //const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
          const minY = Math.max(
            minZXXX - 0.5,
            Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z)),
          );
          //const minY = Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z));
          const scaleX =
            (ctx.canvas.width - 2 * padding) /
            (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
          const scaleY =
            (ctx.canvas.height - 2 * padding) /
            (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

          //drawXAxis(ctx, scaleY, padding, minY);

          //drawYAxis(ctx, scaleX, padding, minX);
          drawYAxis(ctx, eckenListe, padding, scaleX, minY, scaleY);
          drawXAxis(
            ctx,
            eckenListe,
            rowData.standartWerte,
            padding,
            scaleY,
            minX,
            minY,
          );
          //drawYAxis(ctx, eckenListe, padding, scaleX, minY);
          // drawYAxis(
          //   ctx,
          //   scaleX,
          //   padding,
          //   minX,
          //   rowData.standartWerte.obereToleranz,
          // );
          // drawYAxis(
          //   ctx,
          //   scaleX,
          //   padding,
          //   minX,
          //   eckenListe.ecke,
          //   //rowData.standartWerte.obereToleranz,
          //   //rowData.recipe.eckenListe,
          // );
          drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);
          drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);

          // //drawScaleX(ctx, eckenListe, rowData.standartWerte);
          if (rowData.standartWerte) {
            drawUpperToleranceLine(
              ctx,
              eckenListe,
              rowData.standartWerte,
              scaleX,
              scaleY,
              padding,
              minX,
              minY,
            );
            drawLowerToleranceLine(
              ctx,
              eckenListe,
              rowData.standartWerte,
              scaleX,
              scaleY,
              padding,
              minX,
              minY,
            );
          }
        });
      });
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable:', error);
    showAlert('error', err.response.data.message);
  }
};

function drawXAxis(
  ctx,
  eckenListe,
  standartWerte,
  padding,
  scaleY,
  minX,
  minY,
) {
  const xAxisY = ctx.canvas.height - padding - (0 - minY) * scaleY;

  console.log('xAxisY: ', xAxisY);

  // ctx.beginPath();
  // ctx.moveTo(padding, xAxisY);
  // ctx.lineTo(ctx.canvas.width - padding, xAxisY);
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 20;
  // ctx.stroke();

  // // Beschriftung für die x-Länge
  // ctx.font = '10px Arial';
  // ctx.fillStyle = 'black';
  // ctx.textAlign = 'center';
  // //ctx.strokeStyle = 'red';

  const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
  const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);
  const yPos = ctx.canvas.height - padding + 0.2 / scaleY + 0;

  // for (let i = 0; i <= maxX; i++) {
  //   ctx.beginPath();
  //   ctx.moveTo(yPos, yPos + i);
  //   ctx.lineTo(yPos - 0.1, yPos + i); // Hier können Sie die Länge der Linie anpassen
  //   ctx.strokeStyle = 'pink';
  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // }

  for (let x = minX; x <= maxX; x += 250) {
    const xPos = padding + (x - minX) * scaleX;

    console.log('xPos: ' + xPos);

    ctx.fillText(x.toString(), xPos, yPos + 20);
  }

  const yPosXXX = ctx.canvas.height - padding + 0.2 / scaleY + 0; // gleiche yPos wie in Ihrer vorherigen Funktion

  for (let i = 0; i <= ctx.canvas.width - 2 * padding; i++) {
    ctx.beginPath();
    ctx.moveTo(padding + i, yPosXXX);
    ctx.lineTo(padding + i + 1, yPosXXX); // Hier können Sie die Länge der Linie anpassen
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
// function drawXAxis(
//   ctx,
//   eckenListe,
//   standartWerte,
//   padding,
//   scaleY,
//   minX,
//   minY,
// ) {
//   const xAxisY = ctx.canvas.height - padding - (0 - minY) * scaleY;

//   console.log('xAxisY:', xAxisY); // Debugging-Ausgabe

//   ctx.beginPath();
//   ctx.moveTo(padding, xAxisY);
//   ctx.lineTo(ctx.canvas.width - padding, xAxisY);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();
// }

//-----------------------down y funktioniert-------------------------------------------------------
function drawYAxis(ctx, eckenListe, padding, scaleX, minY, scaleY) {
  console.log('bin drawYaxis');
  // Y-Position der Y-Achse berechnen
  //const yAxisX = padding + (0 - minY) * scaleX;
  const yAxisX = padding + (0 - minY) * scaleX; //pposition 0 bei x-achse-0
  console.log('yAxisX: ' + yAxisX);
  console.log('scaleX: ' + scaleX);

  // Y-Achse zeichnen
  ctx.beginPath();
  ctx.moveTo(yAxisX, 0.5); //0.5); //padding);
  ctx.lineTo(yAxisX, ctx.canvas.height - padding);
  //ctx.lineTo(yAxisX, ctx.canvas.height - 130);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Beschriftung für die Y-Länge
  ctx.font = '7px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'right';

  const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));
  const minZ = Math.min(...eckenListe.ecke.map((ecke) => ecke.z)) - 0.5;

  const step = 0.1;
  for (let y = minZ; y <= maxY + 0.5; y += step) {
    //Schrift-bezeichnung
    //minZ - 0.2
    //const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
    const yPos = ctx.canvas.height - padding - (y - minY) * scaleY; // text unterhalb zahlen
    //ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
    ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
  }
}

function drawScaleX(ctx, eckenListe, standartWerte) {
  const padding = 210;

  // Skalierungsfaktor für die x-Länge berechnen
  const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
  const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
  const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

  // Minimalen und maximalen y-Wert unter Berücksichtigung von Toleranzen berechnen
  const minY = Math.min(
    ...(eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz) +
      2),
  );
  const maxY = Math.max(
    ...(eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz) +
      2),
  );

  // Skalierungsfaktor für die y-Höhe berechnen
  const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

  // Y-Position der Achse anpassen, um unterhalb der Skizze zu liegen
  const yPos = ctx.canvas.height - padding + 0.2 / scaleY + 0; // Hier können Sie den Wert anpassen

  // Skala für die x-Länge zeichnen
  ctx.beginPath();
  ctx.moveTo(padding, yPos);
  ctx.lineTo(ctx.canvas.width - padding, yPos);
  ctx.stroke();

  // Beschriftung für die x-Länge
  ctx.font = '10px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';

  for (let x = minX; x <= maxX; x += 250) {
    const xPos = padding + (x - minX) * scaleX;
    ctx.fillText(x.toString(), xPos, yPos + 20);
  }
}

//----------------drawgrid und eckenliste funktioniert mit y-achse alt ---------------------
function drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
  ctx.beginPath();
  ctx.strokeStyle = '#ddd'; // Farbe des Rasters (z.B., grau)
  ctx.lineWidth = 1;

  // Vertikale Linien entsprechend der X-Achse
  eckenListe.ecke.forEach((ecke) => {
    const x = padding + (ecke.x - minX) * scaleX;
    ctx.moveTo(x, padding);
    ctx.lineTo(x, ctx.canvas.height - padding);
  });

  // Horizontale Linien entsprechend der Y-Wanddicke
  eckenListe.ecke.forEach((ecke) => {
    const y = ctx.canvas.height - padding - (ecke.z - minY) * scaleY;
    ctx.moveTo(padding, y);
    ctx.lineTo(ctx.canvas.width - padding, y);
  });

  ctx.stroke();
}

function drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
  // Eckenliste zeichnen
  ctx.beginPath();
  ctx.moveTo(
    padding + (eckenListe.ecke[0].x - minX) * scaleX,
    ctx.canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
  );

  for (const ecke of eckenListe.ecke) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

function drawUpperToleranceLine(
  ctx,
  eckenListe,
  standartWerte,
  scaleX,
  scaleY,
  padding,
  minX,
  minY,
) {
  const upperToleranceEckenListe = eckenListe.ecke.map((e) => {
    return { x: e.x, z: e.z + standartWerte.obereToleranz };
  });

  ctx.beginPath();
  ctx.strokeStyle = 'green';

  // Zeichne obere Toleranzlinie
  ctx.moveTo(
    padding + (upperToleranceEckenListe[0].x - minX) * scaleX,
    ctx.canvas.height -
      padding -
      (upperToleranceEckenListe[0].z - minY) * scaleY,
  );

  for (const ecke of upperToleranceEckenListe) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.stroke();
}

function drawLowerToleranceLine(
  ctx,
  eckenListe,
  standartWerte,
  scaleX,
  scaleY,
  padding,
  minX,
  minY,
) {
  const lowerToleranceEckenListe = eckenListe.ecke.map((e) => {
    return { x: e.x, z: e.z - standartWerte.untereToleranz };
  });

  ctx.beginPath();
  ctx.strokeStyle = 'darkgreen';

  // Zeichne untere Toleranzlinie
  ctx.moveTo(
    padding + (lowerToleranceEckenListe[0].x - minX) * scaleX,
    ctx.canvas.height -
      padding -
      (lowerToleranceEckenListe[0].z - minY) * scaleY,
  );

  for (const ecke of lowerToleranceEckenListe) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.stroke();
}

//-----------------------------------------------funktioniert-------------------------------

//---------------------------------------------------------------------------
function generateDynamicContent(rowData) {
  const canvasWidth = 900; //550;
  const canvasHeight = 550; //550; //800; //550;
  const maxX = 2000;
  const maxZ = 8;
  const tolerance = 2;

  return `

    <h1 style="margin-left:25px;">${rowData.artikelNummer}</h1>
    <h1 style="margin-left:25px;">${rowData.artikelName}</h1>

    <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: 500px; border: 2px solid transparent; position: relative; overflow: hidden;">
      <canvas id="eckenCanvas" style="position: absolute;  border: 5px solid transparent; padding-top: 10px; margin-left: -75px; margin-top: 1px;" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    </div>

    <!-- <p></p> -->
    <!-- <p></p> -->
    <!-- <p style="color: black;">Artikelnummer: ${
      rowData.artikelNummer
    }</p> -->
    <!-- <p style="color: black;">ArtikelName: ${rowData.artikelName}</p> -->
    <!-- <p>Kommentar: ${rowData.kommentar}</p> -->
    <!-- <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p> -->
    <!-- <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p> -->
    <!-- <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p> -->
    <p></p>
    <h2 style="color: black; margin-left:25px;">Zieh-Geschwindigkeit: ${JSON.stringify(
      rowData.ziehGeschwindigkeit,
    )}</h2>
    <h2 style="color: black; margin-left:25px;">Profile gekoppelt: ${JSON.stringify(
      rowData.rohrWerte.profileGekoppelt,
    )}</h2>
    <br></br>
    <!-- <p></p> -->
  `;
}
// top: 0; left: 0;
export default convertOldRecipes;

// function generateDynamicContent(rowData) {
//   const canvasWidth = 500;
//   const canvasHeight = 500;
//   //   <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: ${canvasHeight}px; border: 2px solid red; position: relative;overflow: hidden;">
//   //   <canvas id="eckenCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
//   // </div>
//   return `
//     <p>Artikelnummer: ${rowData.artikelNummer}</p>
//     <p>ArtikelName: ${rowData.artikelName}</p>
//     <p>Kommentar: ${rowData.kommentar}</p>
//     <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//     <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//     <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p>
//     <p></p>
//     <p></p>

//   <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: ${canvasHeight}px; border: 2px solid red; position: relative; overflow: hidden;">
//   <canvas id="eckenCanvas" style="position: absolute; top: 0; left: 0;" width="${canvasWidth}" height="${canvasHeight}"></canvas>
// </div>
//   `;
// }

//------------------------------funktioniert halbwegs-------------------------------------
// function drawEckenListe(ctx, eckenListe) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

//   // Eckenliste zeichnen
//   ctx.beginPath();
//   ctx.moveTo(
//     padding + (eckenListe.ecke[0].x - minX) * scaleX,
//     ctx.canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//   );

//   for (const ecke of eckenListe.ecke) {
//     ctx.lineTo(
//       padding + (ecke.x - minX) * scaleX,
//       ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// }

// function drawEckenListe(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(
//     ...eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz),
//   );

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(
//       ...eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz),
//     ) -
//       minY);

//   // Eckenliste zeichnen
//   ctx.beginPath();
//   ctx.moveTo(
//     padding + (eckenListe.ecke[0].x - minX) * scaleX,
//     ctx.canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//   );

//   for (const ecke of eckenListe.ecke) {
//     ctx.lineTo(
//       padding + (ecke.x - minX) * scaleX,
//       ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// }
//-------------------------------------------------------------------------------
// function drawGrid(ctx, eckenListe) {
//   const padding = 100;
//   const gridSizeX = 10; //50;
//   const gridSizeY = 10; //50;

//   // Raster zeichnen
//   for (
//     let x = padding + gridSizeX;
//     x < ctx.canvas.width - padding;
//     x += gridSizeX
//   ) {
//     ctx.beginPath();
//     ctx.moveTo(x, padding);
//     ctx.lineTo(x, ctx.canvas.height - padding);
//     ctx.strokeStyle = '#ddd';
//     ctx.stroke();
//   }

//   for (
//     let y = padding + gridSizeY;
//     y < ctx.canvas.height - padding;
//     y += gridSizeY
//   ) {
//     ctx.beginPath();
//     ctx.moveTo(padding, y);
//     ctx.lineTo(ctx.canvas.width - padding, y);
//     ctx.strokeStyle = '#ddd';
//     ctx.stroke();
//   }
// }

//--------------------------funktioniert halbwegs--------------------------------------
// $(document).ready(function () {
//   $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//     const rowData = dataTable.row(this).data();
//     console.log('rowData:', rowData);

//     const eckenListe = rowData.eckenListe;

//     const dynamicContent = generateDynamicContent(rowData);
//     $('#rightDiv').html(dynamicContent);

//     // Canvas für die Eckenliste zeichnen
//     const canvas = document.getElementById('eckenCanvas');
//     if (!canvas) {
//       console.error('Canvas-Element nicht gefunden');
//       return;
//     }

//     const ctx = canvas.getContext('2d');

//     //drawScaleX(ctx, eckenListe, rowData.standartWerte);
//     //drawScaleY(ctx, eckenListe, rowData.standartWerte);
//     //drawGrid(ctx, eckenListe);
//     //drawEckenListe(ctx, eckenListe, rowData.standartWerte);
//     drawEckenListe(ctx, eckenListe);

//     // Zusätzliche Linien zeichnen
//     if (rowData.standartWerte) {
//       //drawAdditionalLines(ctx, eckenListe, rowData.standartWerte);
//       drawUpperToleranceLine(ctx, eckenListe, rowData.standartWerte);
//       drawLowerToleranceLine(ctx, eckenListe, rowData.standartWerte);
//     }
//   });
// });

//-------------------------funktionieren aber in der höhe nicht------------------------------
// function drawUpperToleranceLine(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

//   const upperToleranceEckenListe = eckenListe.ecke.map((e) => {
//     return { x: e.x, z: e.z + standartWerte.obereToleranz };
//   });

//   ctx.beginPath();
//   ctx.strokeStyle = 'green';

//   // Zeichne obere Toleranzlinie
//   ctx.moveTo(
//     padding + (upperToleranceEckenListe[0].x - minX) * scaleX,
//     ctx.canvas.height -
//       padding -
//       (upperToleranceEckenListe[0].z - minY) * scaleY,
//   );

//   for (const ecke of upperToleranceEckenListe) {
//     ctx.lineTo(
//       padding + (ecke.x - minX) * scaleX,
//       ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.stroke();
// }

// function drawLowerToleranceLine(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

//   const lowerToleranceEckenListe = eckenListe.ecke.map((e) => {
//     return { x: e.x, z: e.z - standartWerte.untereToleranz };
//   });

//   ctx.beginPath();
//   ctx.strokeStyle = 'darkgreen';

//   // Zeichne untere Toleranzlinie
//   ctx.moveTo(
//     padding + (lowerToleranceEckenListe[0].x - minX) * scaleX,
//     ctx.canvas.height -
//       padding -
//       (lowerToleranceEckenListe[0].z - minY) * scaleY,
//   );

//   for (const ecke of lowerToleranceEckenListe) {
//     ctx.lineTo(
//       padding + (ecke.x - minX) * scaleX,
//       ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.stroke();
// }
// function drawXAxis(ctx, scaleY, padding, minY) {
//   // Y-Position der X-Achse berechnen
//   const xAxisY = ctx.canvas.height - padding - (0 - minY) * scaleY;

//   // X-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, xAxisY);
//   ctx.lineTo(ctx.canvas.width - padding, xAxisY);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();
// }

// function drawYAxis(ctx, scaleX, padding, minX) {//funktioniert
//   // X-Position der Y-Achse berechnen
//   const yAxisX = padding + (0 - minX) * scaleX;

//   // Y-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(yAxisX, padding);
//   ctx.lineTo(yAxisX, ctx.canvas.height - padding);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();
// }
// // drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);
// // drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);
// function drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
//   ctx.beginPath();
//   ctx.moveTo(
//     padding + (eckenListe.ecke[0].x - minX) * scaleX,
//     ctx.canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//   );

//   for (let i = 1; i < eckenListe.ecke.length; i++) {
//     ctx.lineTo(
//       padding + (eckenListe.ecke[i].x - minX) * scaleX,
//       ctx.canvas.height - padding - (eckenListe.ecke[i].z - minY) * scaleY,
//     );
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// }

// function drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
//   const minYDisplay = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const scaleYDisplay =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minYDisplay);

//   // Horizontal Linien
//   for (
//     let y = minYDisplay;
//     y <= Math.max(...eckenListe.ecke.map((ecke) => ecke.z));
//     y += 0.5
//   ) {
//     const yPos =
//       ctx.canvas.height - padding - (y - minYDisplay) * scaleYDisplay;
//     ctx.beginPath();
//     ctx.moveTo(padding, yPos);
//     ctx.lineTo(ctx.canvas.width - padding, yPos);
//     ctx.strokeStyle = 'lightgray';
//     ctx.stroke();
//   }

//   // Vertikale Linien
//   for (
//     let x = minX;
//     x <= Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//     x += 250
//   ) {
//     const xPos = padding + (x - minX) * scaleX;
//     ctx.beginPath();
//     ctx.moveTo(xPos, ctx.canvas.height - padding);
//     ctx.lineTo(xPos, padding);
//     ctx.strokeStyle = 'lightgray';
//     ctx.stroke();
//   }
// }

// function drawYAxis(ctx, eckenListe, padding, scaleX, minY) {
//   const minZ = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const minYDisplay = minZ - 0.2; // Der minimale y-Wert, der angezeigt werden soll
//   const yAxisX = padding + (0 - minY) * scaleX;
//   const yAxisStartY =
//     ctx.canvas.height - padding - (minYDisplay - minY) * scaleX;

//   // Y-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(yAxisX, yAxisStartY);
//   ctx.lineTo(yAxisX, ctx.canvas.height - padding);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();

//   // Beschriftung für die Y-Länge
//   ctx.font = '8px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'right';

//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));
//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minYDisplay);

//   for (let y = minYDisplay; y <= maxY; y += 0.1) {
//     const yPos = ctx.canvas.height - padding - (y - minYDisplay) * scaleY;
//     ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
//   }
// }
// function drawYAxis(ctx, eckenListe, padding, scaleX, minY, scaleY) {
//   // Y-Position der Y-Achse berechnen
//   const minYDisplay = 2.5; // Der minimale y-Wert, der angezeigt werden soll
//   const yAxisX = padding + (0 - minY) * scaleX;
//   const yAxisStartY =
//     ctx.canvas.height - padding - (minYDisplay - minY) * scaleX;

//   // Y-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(yAxisX, yAxisStartY);
//   ctx.lineTo(yAxisX, ctx.canvas.height - padding);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();

//   // Beschriftung für die Y-Länge
//   ctx.font = '10px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'right';

//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   for (let y = minYDisplay; y <= maxY; y += 0.5) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
//   }
// }

// function drawYAxis(ctx, scaleX, scaleY, padding, minX, minY, eckenListe) {
//   // X-Position der Y-Achse berechnen
//   const yAxisX = padding + (0 - minX) * scaleX;

//   // Y-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(yAxisX, padding);
//   ctx.lineTo(yAxisX, ctx.canvas.height - padding);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();

//   // Y-Achse beschriften mit Wanddicke (Z)
//   ctx.fillStyle = 'black';
//   ctx.font = '14px Arial';
//   ctx.textAlign = 'right';

//   console.log('in drawYAxis eckenListe: ' + eckenListe);
//   eckenListe.forEach((ecke) => {
//     // Stellen Sie sicher, dass ecke.z definiert ist, bevor Sie darauf zugreifen
//     if (ecke && ecke.z !== undefined) {
//       const label = ecke.z.toFixed(2);
//       const labelY = ctx.canvas.height - padding - (ecke.z - minY) * scaleY;
//       ctx.fillText(label, yAxisX - 10, labelY);
//     }
//   });
// }

// function drawYAxis(ctx, scaleX, padding, minX, upperTolerance) {
//   // X-Position der Y-Achse berechnen
//   const yAxisX = padding + (0 - minX) * scaleX;

//   // Y-Achse zeichnen
//   ctx.beginPath();
//   ctx.moveTo(yAxisX, padding - upperTolerance * scaleX);
//   ctx.lineTo(yAxisX, ctx.canvas.height - padding);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();
// }
