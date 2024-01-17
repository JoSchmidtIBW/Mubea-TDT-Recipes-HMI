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
        location.assign(`http://127.0.0.1:6555/api/v1/overview`);
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
        id: recipe._id,
        artikelNummer: recipe.kopfDaten.artikelNummer,
        artikelName: recipe.kopfDaten.artikelName,
        teileNummer: recipe.kopfDaten.teileNummer,
        zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
        aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
        aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
        beschreibung: recipe.kopfDaten.beschreibung,
        ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
        kommentar: recipe.kopfDaten.kommentar,
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
      }));

      console.log('Recipes Array:', recipesArray);

      $('#recipesTDToverviewTable').empty();

      // DataTable mit benutzerdefinierten Optionen initialisieren
      const dataTable = $('#recipesTDToverviewTable').DataTable({
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Display _MENU_ records per page',
          zeroRecords: 'Nothing found - sorry',
          info: 'Showing page _PAGE_ of _PAGES_',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
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
        pageLength: 5,
        columns: [
          { data: 'id', visible: false },
          { data: 'artikelNummer' },
          { data: 'artikelName' },
        ],
        data: recipesArray,
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
          const rowData = dataTable.row(this).data();
          console.log('rowData:', rowData);

          const eckenListe = rowData.eckenListe;

          const dynamicContent = generateDynamicContent(rowData);
          $('#rightDiv').html(dynamicContent);

          // Canvas für die Eckenliste zeichnen
          const canvas = document.getElementById('eckenCanvas');
          if (!canvas) {
            console.error('Canvas-Element nicht gefunden');
            return;
          }

          const ctx = canvas.getContext('2d');

          drawScaleX(ctx, eckenListe, rowData.standartWerte);
          //drawScaleY(ctx, eckenListe, rowData.standartWerte);
          //drawGrid(ctx, eckenListe);
          drawEckenListe(ctx, eckenListe, rowData.standartWerte);

          // Zusätzliche Linien zeichnen
          if (rowData.standartWerte) {
            //drawAdditionalLines(ctx, eckenListe, rowData.standartWerte);
            drawUpperToleranceLine(ctx, eckenListe, rowData.standartWerte);
            drawLowerToleranceLine(ctx, eckenListe, rowData.standartWerte);
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

// function drawScaleX(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   // Skalierungsfaktor für die x-Länge berechnen
//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//   const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

//   // // Y-Position der Achse anpassen, um unterhalb der Skizze zu liegen
//   // const minY = Math.min(
//   //   ...eckenListe.ecke.map(
//   //     (ecke) => ecke.z - standartWerte.untereToleranz - 0.2,
//   //   ),
//   // );
//   // const maxY = Math.max(
//   //   ...eckenListe.ecke.map(
//   //     (ecke) => ecke.z + standartWerte.obereToleranz + 0.2,
//   //   ),
//   // );
//   // const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);
//   // const yPos = ctx.canvas.height - padding - (minY - minY) * scaleY + 20;
//   // Minimalen und maximalen y-Wert unter Berücksichtigung von Toleranzen berechnen
//   const minY = Math.min(
//     ...eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz),
//   );
//   const maxY = Math.max(
//     ...eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz),
//   );

//   // Skalierungsfaktor für die y-Höhe berechnen
//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Y-Position der Achse anpassen, um unterhalb der Skizze zu liegen
//   const yPos = ctx.canvas.height - padding / scaleY;

//   // Skala für die x-Länge zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, yPos);
//   ctx.lineTo(ctx.canvas.width - padding, yPos);
//   ctx.stroke();

//   // Beschriftung für die x-Länge
//   ctx.font = '10px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'center';

//   for (let x = minX; x <= maxX; x += 250) {
//     const xPos = padding + (x - minX) * scaleX;
//     ctx.fillText(x.toString(), xPos, yPos + 20);
//   }
// }
function drawScaleX(ctx, eckenListe, standartWerte) {
  const padding = 100;

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
// function drawScaleX(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   // Skalierungsfaktor für die x-Länge berechnen
//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//   const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

//   // Minimalen und maximalen y-Wert unter Berücksichtigung von Toleranzen berechnen
//   const minY = Math.min(
//     ...eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz),
//   );
//   const maxY = Math.max(
//     ...eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz),
//   );

//   // Skalierungsfaktor für die y-Höhe berechnen
//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Y-Position der Achse anpassen, um unterhalb der Skizze zu liegen
//   const yPos =
//     ctx.canvas.height - padding - standartWerte.untereToleranz * scaleY + 100;

//   // Skala für die x-Länge zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, yPos);
//   ctx.lineTo(ctx.canvas.width - padding, yPos);
//   ctx.stroke();

//   // Beschriftung für die x-Länge
//   ctx.font = '10px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'center';

//   for (let x = minX; x <= maxX; x += 250) {
//     const xPos = padding + (x - minX) * scaleX;
//     ctx.fillText(x.toString(), xPos, yPos + 20);
//   }
// }
//------------------------------funktioniert halbwegs-------------------------------------1
function drawUpperToleranceLine(ctx, eckenListe, standartWerte) {
  const padding = 100;

  const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
  const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

  const scaleX =
    (ctx.canvas.width - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
  const scaleY =
    (ctx.canvas.height - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

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

function drawLowerToleranceLine(ctx, eckenListe, standartWerte) {
  const padding = 100;

  const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
  const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

  const scaleX =
    (ctx.canvas.width - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
  const scaleY =
    (ctx.canvas.height - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

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

// function drawAdditionalLines(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

//   ctx.beginPath();
//   ctx.strokeStyle = 'green';

//   // Zeichne zusätzliche Linien für jede Ecke in der Eckenliste
//   for (const ecke of eckenListe.ecke) {
//     const xPos = padding + (ecke.x - minX) * scaleX;
//     const yPos = ctx.canvas.height - padding - (ecke.z - minY) * scaleY;

//     // Zeichne zusätzliche Linie für obere Toleranz
//     const yPosUpperTolerance =
//       ctx.canvas.height -
//       padding -
//       (ecke.z + standartWerte.obereToleranz - minY) * scaleY;
//     ctx.moveTo(xPos, yPosUpperTolerance);
//     ctx.lineTo(xPos, yPos);

//     // Zeichne zusätzliche Linie für untere Toleranz
//     const yPosLowerTolerance =
//       ctx.canvas.height -
//       padding -
//       (ecke.z - standartWerte.untereToleranz - minY) * scaleY;
//     ctx.moveTo(xPos, yPos);
//     ctx.lineTo(xPos, yPosLowerTolerance);
//   }

//   ctx.stroke();
// }

// function drawAdditionalLines(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX =
//     (ctx.canvas.width - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

//   ctx.beginPath();
//   ctx.strokeStyle = 'green';

//   // Zeichne zusätzliche Linien für jede Ecke in der Eckenliste
//   for (const ecke of eckenListe.ecke) {
//     const xPos = padding + (ecke.x - minX) * scaleX;
//     const yPos = ctx.canvas.height - padding - (ecke.z - minY) * scaleY;

//     // Berechne Eckenliste für obere Toleranz
//     const eckenListeObereToleranz = eckenListe.ecke.map((e) => {
//       return { x: e.x, z: e.z + standartWerte.obereToleranz };
//     });

//     // Berechne Eckenliste für untere Toleranz
//     const eckenListeUntereToleranz = eckenListe.ecke.map((e) => {
//       return { x: e.x, z: e.z - standartWerte.untereToleranz };
//     });

//     // Zeichne zusätzliche Linie für obere Toleranz
//     const yPosUpperTolerance =
//       ctx.canvas.height -
//       padding -
//       (eckenListeObereToleranz.find((e) => e.x === ecke.x)?.z - minY) * scaleY;
//     ctx.moveTo(xPos, yPosUpperTolerance);
//     ctx.lineTo(xPos, yPos);

//     // Zeichne zusätzliche Linie für untere Toleranz
//     const yPosLowerTolerance =
//       ctx.canvas.height -
//       padding -
//       (eckenListeUntereToleranz.find((e) => e.x === ecke.x)?.z - minY) * scaleY;
//     ctx.moveTo(xPos, yPos);
//     ctx.lineTo(xPos, yPosLowerTolerance);
//   }

//   ctx.stroke();
// }
//-----------------------------------------------funktioniert-------------------------------
// function generateDynamicContent(rowData) {

//   return `
//     <p>Artikelnummer: ${rowData.artikelNummer}</p>
//     <p>ArtikelName: ${rowData.artikelName}</p>
//     <p>Kommentar: ${rowData.kommentar}</p>
//     <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//     <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//     <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p>
//     <p></p>
//     <p></p>

//     <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//       <canvas id="eckenCanvas" width="450" height="450"></canvas>
//     </div>
//   `;
// }
//---------------------------------------------------------------------------
function generateDynamicContent(rowData) {
  const canvasWidth = 500; // Passen Sie die Canvas-Breite an Ihre Anforderungen an
  const canvasHeight = 500; // Passen Sie die Canvas-Höhe an Ihre Anforderungen an

  //   <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: ${canvasHeight}px; border: 2px solid red;">
  //   <canvas id="eckenCanvas" style="width: ${canvasWidth - 50}px; height: ${
  //     canvasHeight - 50
  //   }px"></canvas>
  // </div>

  return `
    <p>Artikelnummer: ${rowData.artikelNummer}</p>
    <p>ArtikelName: ${rowData.artikelName}</p>
    <p>Kommentar: ${rowData.kommentar}</p>
    <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
    <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
    <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p>
    <p></p>
    <p></p>


    <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: ${canvasHeight}px; border: 2px solid red; position: relative;overflow: hidden;">
    <canvas id="eckenCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
  </div>
  `;
}

// function drawScaleX(ctx, eckenListe) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));

//   const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

//   // Skala für die x-Länge zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, ctx.canvas.height - padding);
//   ctx.lineTo(ctx.canvas.width - padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die x-Länge
//   ctx.font = '10px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'center';
//   for (let x = minX; x <= maxX; x += 250) {
//     const xPos = padding + (x - minX) * scaleX;
//     ctx.fillText(x.toString(), xPos, ctx.canvas.height - padding + 20);
//   }
// }

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 0.05;

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   //ctx.fillText(maxY.toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = ctx.canvas.height - padding - (minY - minY) * scaleY + 20; // oder -padding;
//   //ctx.fillText(minY.toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // for (let y = minY; y <= maxY; y += stepSize) {
//   //   const yPos = yPosMin - (y - minY) * scaleY;
//   //   ctx.fillText(y.toFixed(2), 0, yPos);
//   // }

//   // for (let y = minY; y <= maxY; y += stepSize) {
//   //   const yPos = yPosMin - (y - minY) * scaleY;
//   //   ctx.fillText(y.toFixed(2), 0, yPos);
//   // }
//   // Zeichne die Punkte zwischen yPosMin und yPosMax
//   for (let y = minY; y <= maxY; y += stepSize) {
//     //for (let y = minY + stepSize; y <= maxY - stepSize; y += stepSize) {
//     const yPos = yPosMin - 240 - (y - minY) * scaleY;
//     // Überprüfe, ob der Punkt innerhalb des Bereichs yPosMin bis yPosMax liegt
//     if (yPos >= yPosMax && yPos <= yPosMin) {
//       ctx.fillText(y.toFixed(2), 0, yPos);
//     }
//   }
//   ctx.restore();
// }
//-------------------------------------------------------------------------------------------
// function drawScaleX(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));

//   const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

//   // Skala für die x-Länge zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, ctx.canvas.height - padding);
//   ctx.lineTo(ctx.canvas.width - padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die x-Länge
//   ctx.font = '10px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'center';

//   // Berechne die maximale Wanddicke mit oberer Toleranz
//   const maxThicknessUpperTolerance = Math.max(
//     ...eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz),
//   );

//   // Berechne die minimale Wanddicke mit unterer Toleranz
//   const minThicknessLowerTolerance = Math.min(
//     ...eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz),
//   );

//   const maxYValue = Math.ceil(maxThicknessUpperTolerance / 10) * 10;
//   const minYValue = Math.floor(minThicknessLowerTolerance / 10) * 10;

//   for (let x = minX; x <= maxX; x += 250) {
//     const xPos = padding + (x - minX) * scaleX;
//     ctx.fillText(x.toString(), xPos, ctx.canvas.height - padding + 20);
//   }

//   // Beschriftung für die maximale und minimale Wanddicke
//   ctx.fillText(maxYValue.toFixed(2), padding - 30, padding);
//   ctx.fillText(minYValue.toFixed(2), padding - 30, ctx.canvas.height - padding);
// }

// function drawScaleY(ctx, eckenListe, standartWerte) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY =
//     (ctx.canvas.height - 2 * padding) /
//     (maxY - minY + 2 * standartWerte.obereToleranz);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 0.05;

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;

//   // Ändere die Position des Textes am unteren Ende
//   //const yPosMin = ctx.canvas.height - padding - (minY - minY) * scaleY + 20; // oder -padding;
//   const yPosMin =
//     ctx.canvas.height -
//     padding -
//     (minY + standartWerte.untereToleranz - minY) * scaleY +
//     20;

//   // Zeichne die Punkte zwischen yPosMin und yPosMax
//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = yPosMin - 240 - (y - minY) * scaleY;
//     if (yPos >= yPosMax && yPos <= yPosMin) {
//       ctx.fillText(y.toFixed(2), 0, yPos);
//     }
//   }

//   // Beschriftung für die maximale und minimale Wanddicke
//   const maxYValue = Math.ceil(maxY / 10) * 10;
//   const minYValue = Math.floor(minY / 10) * 10;

//   // Verwenden Sie jetzt auch standartWerte
//   const maxYWithTolerance = maxY + standartWerte.obereToleranz;
//   const minYWithTolerance = minY - standartWerte.untereToleranz;

//   ctx.fillText(maxYWithTolerance.toFixed(2), 0, yPosMax);
//   ctx.fillText(minYWithTolerance.toFixed(2), 0, yPosMin);

//   ctx.restore();
// }

function drawEckenListe(ctx, eckenListe) {
  const padding = 100;

  const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
  const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

  const scaleX =
    (ctx.canvas.width - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
  const scaleY =
    (ctx.canvas.height - 2 * padding) /
    (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

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

function drawGrid(ctx, eckenListe) {
  const padding = 100;
  const gridSizeX = 10; //50;
  const gridSizeY = 10; //50;

  // Raster zeichnen
  for (
    let x = padding + gridSizeX;
    x < ctx.canvas.width - padding;
    x += gridSizeX
  ) {
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, ctx.canvas.height - padding);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
  }

  for (
    let y = padding + gridSizeY;
    y < ctx.canvas.height - padding;
    y += gridSizeY
  ) {
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(ctx.canvas.width - padding, y);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
  }
}

export default convertOldRecipes;

//----------------------------------------------------ALT DOWN------------------------------------------------------------------------------
//FUNKTIONIERT
// export const showRecipesTDToverviewTable = async () => {
//   console.log('bin showRecipesTDToverviewTable');

//   $('#recipesTDToverviewTable').empty();

//   // Fügen Sie die Pseudo-Daten hinzu
//   const pseudoData = [
//     { id: '1', artikelName: 'BLUME' },
//     // Weitere Pseudo-Daten nach Bedarf hinzufügen
//   ];

//   // Durchlaufen Sie die Pseudo-Daten und fügen Sie sie zur Tabelle hinzu
//   pseudoData.forEach((data) => {
//     $('#recipesTDToverviewTable').append(`
//       <tr>
//         <td>${data.id}</td>
//         <td>${data.artikelName}</td>
//       </tr>
//     `);
//   });
// };

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 0.05;

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   //ctx.fillText(maxY.toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = ctx.canvas.height - padding - (minY - minY) * scaleY + 20; // oder -padding;
//   //ctx.fillText(minY.toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // for (let y = minY; y <= maxY; y += stepSize) {
//   //   const yPos = yPosMin - (y - minY) * scaleY;
//   //   ctx.fillText(y.toFixed(2), 0, yPos);
//   // }

//   // for (let y = minY; y <= maxY; y += stepSize) {
//   //   const yPos = yPosMin - (y - minY) * scaleY;
//   //   ctx.fillText(y.toFixed(2), 0, yPos);
//   // }
//   // Zeichne die Punkte zwischen yPosMin und yPosMax
//   for (let y = minY; y <= maxY; y += stepSize) {
//     //for (let y = minY + stepSize; y <= maxY - stepSize; y += stepSize) {
//     const yPos = yPosMin - 240 - (y - minY) * scaleY;
//     // Überprüfe, ob der Punkt innerhalb des Bereichs yPosMin bis yPosMax liegt
//     if (yPos >= yPosMax && yPos <= yPosMin) {
//       ctx.fillText(y.toFixed(2), 0, yPos);
//     }
//   }
//   ctx.restore();
// }

// // Event-Handler für das Klick-Ereignis der Tabellenzeilen hinzufügen
// $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//   const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//   console.log('rowData: ' + rowData);
//   console.log('JSON.stringify(rowData):', JSON.stringify(rowData));

//   if (rowData) {
//     // Wenn Daten vorhanden sind
//     $('#rightDiv').html(
//       `
//       <p>Artikelnummer: ${rowData.artikelNummer}</p>
//       <p>ArtikelName: ${rowData.artikelName}</p>
//       <p>Komentar: ${rowData.kommentar}</p>
//       <p>dornStufen: ${JSON.stringify(rowData.dornStufen)}</p>
//       <p>eckenListe: ${JSON.stringify(rowData.eckenListe)}</p>
//       `,
//     );
//   }
// });

// $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//   const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//   console.log('rowData:', rowData);

//   const eckenListe = rowData.eckenListe;

//   const dynamicContent = `
//   <p>Artikelnummer: ${rowData.artikelNummer}</p>
//   <p>ArtikelName: ${rowData.artikelName}</p>
//   <p>Kommentar: ${rowData.kommentar}</p>
//   <p>Dornstufen: ${JSON.stringify(rowData.dornStufen)}</p>
//   <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//   <p></p>
//   <p></p>

//   <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//   <canvas id="eckenCanvas" width="500" height="500"></canvas>
//   </div>
//   `;

//   $('#rightDiv').html(dynamicContent);

//   // Canvas für die Eckenliste zeichnen
//   const canvas = document.getElementById('eckenCanvas');
//   const ctx = canvas.getContext('2d');

//   ctx.beginPath();
//   ctx.moveTo(0, canvas.height - eckenListe.ecke[0].z * 15);

//   for (const ecke of eckenListe.ecke) {
//     ctx.lineTo(ecke.x, canvas.height - ecke.z * 15);
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// });
// $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//   const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//   console.log('rowData:', rowData);

//   const eckenListe = rowData.eckenListe;

//   const dynamicContent = `
//     <p>Artikelnummer: ${rowData.artikelNummer}</p>
//     <p>ArtikelName: ${rowData.artikelName}</p>
//     <p>Kommentar: ${rowData.kommentar}</p>
//     <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//     <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//     <p></p>
//     <p></p>

//     <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//       <canvas id="eckenCanvas" width="450" height="450" ></canvas>
//     </div>
//   `;

//   $('#rightDiv').html(dynamicContent);

//   // Canvas für die Eckenliste zeichnen
//   const canvas = document.getElementById('eckenCanvas');
//   const ctx = canvas.getContext('2d');

//   const padding = 10;

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
//   const scaleY = (canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die x-Länge zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, canvas.height - padding);
//   ctx.lineTo(canvas.width - padding, canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die x-Länge
//   ctx.font = '20px Arial';
//   ctx.fillStyle = 'black';
//   ctx.textAlign = 'center';
//   //ctx.fillText(`Y (min: ${minY}, max: ${maxY})`, 0, 0);
//   // ctx.fillText(
//   //   `X (min: ${minX}, max: ${maxX})`,
//   //   canvas.width / 2,
//   //   canvas.height - padding + 20,
//   // );
//   ctx.fillText(`X (min: ${minX}, max: ${maxX})`, 0, 0);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(
//     padding - 30,
//     padding + (canvas.height - 2 * padding) / 2,
//   );
//   ctx.rotate(-Math.PI / 2);
//   ctx.textAlign = 'center';
//   ctx.fillText(`Z (min: ${minY}, max: ${maxY})`, 0, 0);
//   ctx.restore();

//   // Raster zeichnen
//   const gridSizeX = 50; // Abstand zwischen den vertikalen Linien
//   const gridSizeY = 50; // Abstand zwischen den horizontalen Linien

//   for (
//     let x = padding + gridSizeX;
//     x < canvas.width - padding;
//     x += gridSizeX
//   ) {
//     ctx.beginPath();
//     ctx.moveTo(x, padding);
//     ctx.lineTo(x, canvas.height - padding);
//     ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//     ctx.stroke();
//   }

//   for (
//     let y = padding + gridSizeY;
//     y < canvas.height - padding;
//     y += gridSizeY
//   ) {
//     ctx.beginPath();
//     ctx.moveTo(padding, y);
//     ctx.lineTo(canvas.width - padding, y);
//     ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//     ctx.stroke();
//   }

//   // Eckenliste zeichnen
//   ctx.beginPath();
//   ctx.moveTo(
//     padding + (eckenListe.ecke[0].x - minX) * scaleX,
//     canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//   );

//   for (const ecke of eckenListe.ecke) {
//     ctx.lineTo(
//       padding + (ecke.x - minX) * scaleX,
//       canvas.height - padding - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// });

// // Canvas für die Eckenliste zeichnen
// const canvas = document.getElementById('eckenCanvas');
// const ctx = canvas.getContext('2d');

// const padding = 10;

// const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
// const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
// const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
// const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

// const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
// const scaleY = (canvas.height - 2 * padding) / (maxY - minY);

// // Skala für die x-Länge zeichnen
// ctx.beginPath();
// ctx.moveTo(padding, canvas.height - padding);
// ctx.lineTo(canvas.width - padding, canvas.height - padding);
// ctx.stroke();

// // Skala für die z-Wanddicken zeichnen
// ctx.beginPath();
// ctx.moveTo(padding, padding);
// ctx.lineTo(padding, canvas.height - padding);
// ctx.stroke();

// // Raster zeichnen
// const gridSizeX = 50; // Abstand zwischen den vertikalen Linien
// const gridSizeY = 50; // Abstand zwischen den horizontalen Linien

// for (
//   let x = padding + gridSizeX;
//   x < canvas.width - padding;
//   x += gridSizeX
// ) {
//   ctx.beginPath();
//   ctx.moveTo(x, padding);
//   ctx.lineTo(x, canvas.height - padding);
//   ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//   ctx.stroke();
// }

// for (
//   let y = padding + gridSizeY;
//   y < canvas.height - padding;
//   y += gridSizeY
// ) {
//   ctx.beginPath();
//   ctx.moveTo(padding, y);
//   ctx.lineTo(canvas.width - padding, y);
//   ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//   ctx.stroke();
// }

// // Eckenliste zeichnen
// ctx.beginPath();
// ctx.moveTo(
//   padding + (eckenListe.ecke[0].x - minX) * scaleX,
//   canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
// );

// for (const ecke of eckenListe.ecke) {
//   ctx.lineTo(
//     padding + (ecke.x - minX) * scaleX,
//     canvas.height - padding - (ecke.z - minY) * scaleY,
//   );
// }

// ctx.strokeStyle = 'blue';
// ctx.stroke();
//-----------------------------------------Versuch Ywaagerecht-------------------------------------

//-------------------------------------VERSUCH---------------------------------------------------------
// $(document).ready(function () {
//   $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//     const rowData = dataTable.row(this).data();
//     console.log('rowData:', rowData);

//     const eckenListe = rowData.eckenListe;

//     const dynamicContent = `
//           <p>Artikelnummer: ${rowData.artikelNummer}</p>
//           <p>ArtikelName: ${rowData.artikelName}</p>
//           <p>Kommentar: ${rowData.kommentar}</p>
//           <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//           <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//           <p></p>
//           <p></p>

//           <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//               <canvas id="eckenCanvas" width="450" height="450"></canvas>
//           </div>
//       `;

//     $('#rightDiv').html(dynamicContent);

//     // Canvas für die Eckenliste zeichnen
//     const canvas = document.getElementById('eckenCanvas');
//     if (!canvas) {
//       console.error('Canvas element not found');
//       return;
//     }

//     const ctx = canvas.getContext('2d');

//     const padding = 100;

//     const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//     const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//     const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//     const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//     const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
//     const scaleY = (canvas.height - 2 * padding) / (maxY - minY);

//     // Skala für die x-Länge zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, canvas.height - padding);
//     ctx.lineTo(canvas.width - padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die x-Länge
//     ctx.font = '12px Arial';
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'center';
//     for (let x = minX; x <= maxX; x += 250) {
//       const xPos = padding + (x - minX) * scaleX;
//       ctx.fillText(x.toString(), xPos, canvas.height - padding + 20);
//     }

//     // Skala für die z-Wanddicken zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, padding);
//     ctx.lineTo(padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die z-Wanddicken
//     ctx.save();
//     ctx.translate(
//       padding - 30,
//       padding + (canvas.height - 2 * padding) / 2,
//     );
//     ctx.rotate(-Math.PI / 2);
//     ctx.textAlign = 'center';
//     for (let y = minY; y <= maxY; y += 50) {
//       const yPos = (y - minY) * scaleY;
//       ctx.fillText(y.toString(), 0, yPos);
//     }
//     ctx.restore();

//     // Raster zeichnen
//     const gridSizeX = 50;
//     const gridSizeY = 50;

//     for (
//       let x = padding + gridSizeX;
//       x < canvas.width - padding;
//       x += gridSizeX
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(x, padding);
//       ctx.lineTo(x, canvas.height - padding);
//       ctx.strokeStyle = '#ddd';
//       ctx.stroke();
//     }

//     for (
//       let y = padding + gridSizeY;
//       y < canvas.height - padding;
//       y += gridSizeY
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.strokeStyle = '#ddd';
//       ctx.stroke();
//     }

//     // Eckenliste zeichnen
//     ctx.beginPath();
//     ctx.moveTo(
//       padding + (eckenListe.ecke[0].x - minX) * scaleX,
//       canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//     );

//     for (const ecke of eckenListe.ecke) {
//       ctx.lineTo(
//         padding + (ecke.x - minX) * scaleX,
//         canvas.height - padding - (ecke.z - minY) * scaleY,
//       );
//     }

//     ctx.strokeStyle = 'blue';
//     ctx.stroke();
//   });
// });

//------------------------------------VERSUCH----------------------------------------------------------------------
// $(document).ready(function () {
//   $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//     const rowData = dataTable.row(this).data();
//     console.log('rowData:', rowData);

//     const eckenListe = rowData.eckenListe;

//     const dynamicContent = `
//           <p>Artikelnummer: ${rowData.artikelNummer}</p>
//           <p>ArtikelName: ${rowData.artikelName}</p>
//           <p>Kommentar: ${rowData.kommentar}</p>
//           <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//           <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//           <p></p>
//           <p></p>

//           <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//               <canvas id="eckenCanvas" width="450" height="450"></canvas>
//           </div>
//       `;

//     $('#rightDiv').html(dynamicContent);

//     // Canvas für die Eckenliste zeichnen
//     const canvas = document.getElementById('eckenCanvas');
//     if (!canvas) {
//       console.error('Canvas element not found');
//       return;
//     }

//     const ctx = canvas.getContext('2d');

//     const padding = 100;

//     const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//     const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//     const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//     const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//     const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
//     const scaleY = (canvas.height - 2 * padding) / (maxY - minY);

//     // Skala für die x-Länge zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, canvas.height - padding);
//     ctx.lineTo(canvas.width - padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die x-Länge
//     ctx.font = '12px Arial';
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'center';
//     for (let x = minX; x <= maxX; x += 250) {
//       const xPos = padding + (x - minX) * scaleX;
//       ctx.fillText(x.toString(), xPos, canvas.height - padding + 20);
//     }

//     // Skala für die z-Wanddicken zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, padding);
//     ctx.lineTo(padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die z-Wanddicken
//     ctx.save();
//     ctx.translate(
//       padding - 30,
//       padding + (canvas.height - 2 * padding) / 2,
//     );
//     ctx.rotate(-Math.PI / 2);
//     ctx.textAlign = 'center';
//     for (let y = minY; y <= maxY; y += 50) {
//       const yPos = (y - minY) * scaleY;
//       ctx.fillText(y.toString(), 0, yPos);
//     }
//     ctx.restore();

//     // Raster zeichnen
//     const gridSizeX = 50;
//     const gridSizeY = 50;

//     for (
//       let x = padding + gridSizeX;
//       x < canvas.width - padding;
//       x += gridSizeX
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(x, padding);
//       ctx.lineTo(x, canvas.height - padding);
//       ctx.strokeStyle = '#ddd';
//       ctx.stroke();
//     }

//     for (
//       let y = padding + gridSizeY;
//       y < canvas.height - padding;
//       y += gridSizeY
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.strokeStyle = '#ddd';
//       ctx.stroke();
//     }

//     // Eckenliste zeichnen
//     ctx.beginPath();
//     ctx.moveTo(
//       padding + (eckenListe.ecke[0].x - minX) * scaleX,
//       canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//     );

//     for (const ecke of eckenListe.ecke) {
//       ctx.lineTo(
//         padding + (ecke.x - minX) * scaleX,
//         canvas.height - padding - (ecke.z - minY) * scaleY,
//       );
//     }

//     ctx.strokeStyle = 'blue';
//     ctx.stroke();
//   });
// });
//--------------------------------------VERSUCH- funktioniert mit beschriftung und achse und raster--------------------------------------------------
// $(document).ready(function () {
//   $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//     const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//     console.log('rowData:', rowData);

//     const eckenListe = rowData.eckenListe;

//     const dynamicContent = `
//           <p>Artikelnummer: ${rowData.artikelNummer}</p>
//           <p>ArtikelName: ${rowData.artikelName}</p>
//           <p>Kommentar: ${rowData.kommentar}</p>
//           <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//           <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//           <p></p>
//           <p></p>

//           <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//               <canvas id="eckenCanvas" width="450" height="450"></canvas>
//           </div>
//       `;

//     $('#rightDiv').html(dynamicContent);

//     // Canvas für die Eckenliste zeichnen
//     const canvas = document.getElementById('eckenCanvas');
//     if (!canvas) {
//       console.error('Canvas element not found');
//       return;
//     }

//     const ctx = canvas.getContext('2d');

//     const padding = 60;

//     const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//     const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//     const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//     const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//     const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
//     const scaleY = (canvas.height - 2 * padding) / (maxY - minY);

//     // Skala für die x-Länge zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, canvas.height - padding);
//     ctx.lineTo(canvas.width - padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die x-Länge
//     ctx.font = '20px Arial';
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'center';
//     ctx.fillText(
//       `X (min: ${minX}, max: ${maxX})`,
//       canvas.width / 2,
//       canvas.height - padding + 20,
//     );

//     // Skala für die z-Wanddicken zeichnen
//     ctx.beginPath();
//     ctx.moveTo(padding, padding);
//     ctx.lineTo(padding, canvas.height - padding);
//     ctx.stroke();

//     // Beschriftung für die z-Wanddicken
//     ctx.save();
//     ctx.translate(
//       padding - 30,
//       padding + (canvas.height - 2 * padding) / 2,
//     );
//     ctx.rotate(-Math.PI / 2);
//     ctx.textAlign = 'center';
//     ctx.fillText(`Z (min: ${minY}, max: ${maxY})`, 0, 0);
//     ctx.restore();

//     // Raster zeichnen
//     const gridSizeX = 50; // Abstand zwischen den vertikalen Linien
//     const gridSizeY = 50; // Abstand zwischen den horizontalen Linien

//     for (
//       let x = padding + gridSizeX;
//       x < canvas.width - padding;
//       x += gridSizeX
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(x, padding);
//       ctx.lineTo(x, canvas.height - padding);
//       ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//       ctx.stroke();
//     }

//     for (
//       let y = padding + gridSizeY;
//       y < canvas.height - padding;
//       y += gridSizeY
//     ) {
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.strokeStyle = '#ddd'; // Farbe des Rasters
//       ctx.stroke();
//     }

//     // Eckenliste zeichnen
//     ctx.beginPath();
//     ctx.moveTo(
//       padding + (eckenListe.ecke[0].x - minX) * scaleX,
//       canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
//     );

//     for (const ecke of eckenListe.ecke) {
//       ctx.lineTo(
//         padding + (ecke.x - minX) * scaleX,
//         canvas.height - padding - (ecke.z - minY) * scaleY,
//       );
//     }

//     ctx.strokeStyle = 'blue';
//     ctx.stroke();
//   });
// });
//---------------------FUNKTIONIERT-------------------------------------------
// $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//   const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//   console.log('rowData:', rowData);
//   const eckenListe = rowData.eckenListe;

//   const dynamicContent = `
//     <p>Artikelnummer: ${rowData.artikelNummer}</p>
//     <p>ArtikelName: ${rowData.artikelName}</p>
//     <p>Kommentar: ${rowData.kommentar}</p>
//     <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p>
//     <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//     <p></p>
//     <p></p>

//     <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//       <canvas id="eckenCanvas" width="450" height="450" ></canvas>
//     </div>
//   `;

//   $('#rightDiv').html(dynamicContent);
//   // Canvas für die Eckenliste zeichnen
//   const canvas = document.getElementById('eckenCanvas');
//   const ctx = canvas.getContext('2d');

//   const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleX = canvas.width / (maxX - minX);
//   const scaleY = canvas.height / (maxY - minY);

//   ctx.beginPath();
//   ctx.moveTo(
//     (eckenListe.ecke[0].x - minX) * scaleX,
//     canvas.height - (eckenListe.ecke[0].z - minY) * scaleY,
//   );

//   for (const ecke of eckenListe.ecke) {
//     ctx.lineTo(
//       (ecke.x - minX) * scaleX,
//       canvas.height - (ecke.z - minY) * scaleY,
//     );
//   }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// });

//------------------------------------------------------Funktionen-------------------------------------------------------

// export const showRecipesTDToverviewTable = async () => {
//   console.log('bin showRecipesTDToverviewTable');

//   try {
//     const res = await axios({
//       method: 'GET',
//       url: `${apiUrl}/recipes/recipesTDTtoLoad`,
//     });

//     console.log('Response:', res); // Log the entire response

//     if (res.data && res.data.status === 'success') {
//       console.log('Success in showRecipesTDToverviewTable');

//       const pseudoData = [
//         { id: '1', artikelName: 'BLUME' },
//         // Add more pseudo-data as needed
//       ];

//       console.log('Pseudo Data:', pseudoData);

//       const table = $('#recipesTDToverviewTable').DataTable();
//       if (table) {
//         table.destroy();
//       }

//       $('#recipesTDToverviewTable').DataTable({
//         data: pseudoData,
//         columns: [{ data: 'id', visible: true }, { data: 'artikelName' }],
//         // ... andere Optionen
//       });
//     } else {
//       console.error('Error or unsuccessful response:', res.data);
//     }
//   } catch (error) {
//     console.error('Error in showRecipesTDToverviewTable:', error);
//   }
// };
//----------------------------------------------------------------------ALT UP ---------------------------------------------------------------
// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 50;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = padding + (minY - minY) * scaleY; // oder einfach padding
//   ctx.fillText((minY / 100).toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText((maxY / 100).toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 50;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = padding + (minY - minY) * scaleY; // oder einfach padding
//   ctx.fillText((minY / 100).toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText((maxY / 100).toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 0.1;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = ctx.canvas.height - padding - 50; //- 230; //- 400; // - padding - 230; //350; // - padding - 50;//=300 // Verschiebung um 20 Pixel nach unten muss 100 sein
//   ctx.fillText(minY.toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText(maxY.toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }
//----------------------------funktioniert mit zwei zahlen------------------------------------
// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 50;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = padding + (minY - minY) * scaleY; // oder einfach padding
//   ctx.fillText(minY.toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText(maxY.toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   // Annahme: Die Werte in der Eckenliste sind in cm
//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 50;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = padding + (minY - minY) * scaleY; // oder einfach padding
//   ctx.fillText(minY.toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText(maxY.toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }

// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   const stepSize = 50;

//   for (let y = minY; y <= maxY; y += stepSize) {
//     const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
//     ctx.fillText(y.toFixed(2), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   const yPosMin = ctx.canvas.height - padding + 20;
//   ctx.fillText((minY / 100).toFixed(2), 0, yPosMin);
//   console.log('yPosMin: ' + yPosMin);

//   // Ändere die Position des Textes am oberen Ende
//   const yPosMax = -padding - 20;
//   ctx.fillText((maxY / 100).toFixed(2), 0, yPosMax);
//   console.log('yPosMax: ' + yPosMax);

//   ctx.restore();
// }
//---------------------------------------------------------------------------
// function drawScaleY(ctx, eckenListe) {
//   const padding = 100;

//   const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
//   const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));

//   const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

//   // Skala für die z-Wanddicken zeichnen
//   ctx.beginPath();
//   ctx.moveTo(padding, padding);
//   ctx.lineTo(padding, ctx.canvas.height - padding);
//   ctx.stroke();

//   // Beschriftung für die z-Wanddicken
//   ctx.save();
//   ctx.translate(padding - 30, padding + (ctx.canvas.height - 2 * padding) / 2);
//   //ctx.rotate(-Math.PI / 380);
//   //ctx.rotate(-Math.PI / 1);
//   ctx.transform(1, 0, 0, 1, 0, 0);
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle'; // Zentriert den Text vertikal

//   for (let y = minY; y <= maxY; y += 50) {
//     const yPos = (y - minY) * scaleY;
//     ctx.fillText(y.toString(), 0, yPos);
//   }

//   // Ändere die Position des Textes am unteren Ende
//   ctx.fillText((minY / 100).toFixed(2), 0, ctx.canvas.height - padding + 20);

//   // Ändere die Position des Textes am oberen Ende
//   ctx.fillText((maxY / 100).toFixed(2), 0, -padding - 20);

//   ctx.restore();
// }
//-----------------------------------------------------------------------------------------

// $('#rightDiv').html(dynamicContent);
// // Canvas für die Eckenliste zeichnen
// const canvas = document.getElementById('eckenCanvas');
// const ctx = canvas.getContext('2d');

// // Skalierungsfaktoren
// const scaleX = canvas.width / 250; // / 500;
// const scaleY = canvas.height / 200; // / 100;

// ctx.beginPath();
// ctx.moveTo(0, canvas.height - eckenListe.ecke[0].z * scaleY);

// for (const ecke of eckenListe.ecke) {
//   ctx.lineTo(ecke.x * scaleX, canvas.height - ecke.z * scaleY);
// }

// // Farbe ändern
// ctx.strokeStyle = 'blue';

// ctx.stroke();
// // rightDiv aktualisieren
// $('#rightDiv').html(dynamicContent);

// // Canvas für die Eckenliste zeichnen
// const canvas = document.getElementById('eckenCanvas');
// const ctx = canvas.getContext('2d');

// const minX = Math.min(...eckenListe.ecke.map(ecke => ecke.x));
// const minY = Math.min(...eckenListe.ecke.map(ecke => ecke.z));
// const maxX = Math.max(...eckenListe.ecke.map(ecke => ecke.x));
// const maxY = Math.max(...eckenListe.ecke.map(ecke => ecke.z));

// const scaleX = canvas.width / (maxX - minX);
// const scaleY = canvas.height / (maxY - minY);

// ctx.beginPath();
// ctx.moveTo((eckenListe.ecke[0].x - minX) * scaleX, canvas.height - (eckenListe.ecke[0].z - minY) * scaleY);

// for (const ecke of eckenListe.ecke) {
//   ctx.lineTo((ecke.x - minX) * scaleX, canvas.height - (ecke.z - minY) * scaleY);
// }

//   ctx.strokeStyle = 'blue';
//   ctx.stroke();
// if (rowData) {
//   // Wenn Daten vorhanden sind
//   const eckenListe = rowData.eckenListe;

//   // Dynamischen Inhalt für rightDiv erstellen
//   const dynamicContent = `
//     <p>Artikelnummer: ${rowData.artikelNummer}</p>
//     <p>ArtikelName: ${rowData.artikelName}</p>
//     <p>Kommentar: ${rowData.kommentar}</p>
//     <p>Dornstufen: ${JSON.stringify(rowData.dornStufen)}</p>
//     <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p>
//     <p></p>
//     <p></p>

//     <div id="eckenCanvasContainer" style="width: 500px; height: 500px; border: 2px solid red;">
//     <canvas id="eckenCanvas" width="2500" height="500"></canvas>
//   </div>
//   `;

// // DataTable mit benutzerdefinierten Optionen initialisieren
// $('#recipesTDToverviewTable').DataTable({
//   pagingType: 'full_numbers',
//   paging: true,
//   language: {
//     lengthMenu: 'Display _MENU_ records per page',
//     zeroRecords: 'Nothing found - sorry',
//     info: 'Showing page _PAGE_ of _PAGES_',
//     infoEmpty: 'No records available',
//     infoFiltered: '(filtered from _MAX_ total records)',
//     paginate: {
//       first: 'First',
//       last: 'Last',
//       next: 'Next',
//       previous: 'Previous',
//     },
//   },
//   lengthChange: true,
//   lengthMenu: [
//     [2, 5, 10, -1],
//     [2, 5, 10, 'All'],
//   ],
//   pageLength: 5,
//   columns: [
//     { data: 'id', visible: false },
//     { data: 'artikelNummer' },
//     { data: 'artikelName' },
//   ],
//   data: recipesArray,
// });

//-------------------------------------------------------------------------------------------------------------
// $('#recipesTDToverviewTable').empty();

// recipesArray.forEach((data) => {
//   $('#recipesTDToverviewTable').append(`
//     <tr>
//       <td>${data.id}</td>
//       <td>${data.artikelName}</td>
//     </tr>
//   `);
// });

//-----------------------------------------------------------------------------------------------------
// Event-Handler für das Klick-Ereignis der Tabellenzeilen hinzufügen
// $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
//   const rowData = dataTable.row(this).data(); // Daten der angeklickten Zeile abrufen
//   if (rowData) {
//     // Wenn Daten vorhanden sind
//     $('#rightDiv').html(`<p>Artikelnummer: ${rowData.artikelNummer}</p>`);
//   }
// });
//------------------------------------------------------
// try {
//   const res = await axios({
//     method: 'GET',
//     url: `${apiUrl}/recipes/recipesTDTtoLoad`,
//   });

//   if (res.data && res.data.status === 'success') {
//     const pseudoData = [
//       { id: '1', artikelName: 'BLUME' },
//       // Fügen Sie weitere Pseudo-Daten nach Bedarf hinzu
//     ];

//     $('#recipesTDToverviewTable').DataTable().destroy();

//     // DataTable mit Pseudo-Daten initialisieren
//     $('#recipesTDToverviewTable').DataTable({
//       data: pseudoData,
//       dom: 'l<"toolbar">frtip',
//       pagingType: 'full_numbers',
//       paging: true,
//       language: {
//         lengthMenu: 'Display _MENU_ records per page',
//         zeroRecords: 'Nothing found - sorry',
//         info: 'Showing page _PAGE_ of _PAGES_',
//         infoEmpty: 'No records available',
//         infoFiltered: '(filtered from _MAX_ total records)',
//         paginate: {
//           first: 'First',
//           last: 'Last',
//           next: 'Next',
//           previous: 'Previous',
//         },
//       },
//       lengthChange: true,
//       lengthMenu: [
//         [2, 5, 10, -1],
//         [2, 5, 10, 'All'],
//       ],
//       pageLength: 5,
//       columns: [{ data: 'id', visible: true }, { data: 'artikelName' }],
//     });
//   }
// if (res.data.status === 'success') {
//   console.log('success in showRecipesTDToverviewTable');
//   console.log('res: ' + res);
//   console.log('res.data: ' + res.data);
//   console.log('res.data.data: ' + res.data.data);
//   console.log(
//     'res.data.data.recipesTDTtoLoad: ' + res.data.data.recipesTDTtoLoad,
//   );
//   console.log(
//     'Array.isArray(res.data.data.recipesTDTtoLoad): ' +
//       Array.isArray(res.data.data.recipesTDTtoLoad),
//   ); //true
//   console.log(
//     'JSON.stringify(res.data.data.recipesTDTtoLoad): ' +
//       JSON.stringify(res.data.data.recipesTDTtoLoad),
//   );
//   //console.log(res.data.recipesTDTtoLoad.recipe);
//   //console.log(res.data.data.recipesTDTtoLoad.recipe); //undefined
//   // console.log(res.data.data.data.recipesTDTtoLoad.recipe);
//   //console.log(res.data.data.data);

//   const recipesArray = res.data.data.recipesTDTtoLoad.map((recipe) => ({
//     id: recipe._id,
//     artikelName: recipe.kopfDaten.artikelName,
//   }));

//   if (recipesArray.length > 0) {
//     console.log('Recipes Array:', recipesArray);

//     $('#recipesTDToverviewTable').DataTable().destroy();

//     $('#recipesTDToverviewTable').DataTable({
//       data: recipesArray,
//       dom: 'l<"toolbar">frtip',
//       pagingType: 'full_numbers',
//       paging: true,
//       language: {
//         // ... (Rest Ihrer Sprachkonfiguration)
//       },
//       lengthChange: true,
//       lengthMenu: [
//         [2, 5, 10, -1],
//         [2, 5, 10, 'All'],
//       ],
//       pageLength: 5,
//       columns: [{ data: 'id', visible: true }, { data: 'artikelName' }],
//     });
//   } else {
//     console.error('Fehlerhafte oder leere Rezeptdaten:', res.data);
//   }
// }

//     $('#recipesTDToverviewTable').DataTable().destroy();

//     $('#recipesTDToverviewTable').DataTable({
//       data: res.data.data.recipesTDTtoLoad,

//       dom: 'l<"toolbar">frtip',
//       pagingType: 'full_numbers',
//       paging: true,
//       language: {
//         lengthMenu: 'Display _MENU_ records per page',
//         zeroRecords: 'Nothing found - sorry',
//         info: 'Showing page _PAGE_ of _PAGES_',
//         infoEmpty: 'No records available',
//         infoFiltered: '(filtered from _MAX_ total records)',
//         paginate: {
//           first: 'First',
//           last: 'Last',
//           next: 'Next',
//           previous: 'Previous',
//         },
//       },
//       lengthChange: true,
//       lengthMenu: [
//         [2, 5, 10, -1],
//         [2, 5, 10, 'All'],
//       ],
//       pageLength: 5,
//       columns: [
//         {
//           data: 'recipe._id',
//           visible: true, //false,
//         },
//         // { data: 'recipe.kopfDaten.artikelNummer' },
//         { data: 'recipe.kopfDaten.artikelName' },
//         // {
//         //   data: '_id',
//         //   render: function (data) {
//         //     return `
//         //       <a href="${strPathApiV1}/manage_users/${data}" class="edit-button">
//         //         <svg class="heading-box__icon">
//         //         <use xlink:href="/img/icons.svg#icon-edit-3"></use>
//         //         </svg>
//         //       </a>`;
//         //   },
//         //   orderable: false,
//         // },
//       ],
//     });

//     //     const $employeeNumSortAscBtn = $(
//     //       '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
//     //     );
//     //     const $employeeNumSortDescBtn = $(
//     //       '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
//     //     );

//     //     $employeeNumSortAscBtn.on('click', function () {
//     //       $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
//     //     });

//     //     $employeeNumSortDescBtn.on('click', function () {
//     //       $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
//     //     });
//   }
// } catch (err) {
//   showAlert('error', err.response.data.message);
// }
