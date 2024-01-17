import { parseString } from 'xml2js';

export function dataInXml(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, function (err, result) {
      if (err) {
        console.log('Fehler beim Parsen des XML in dataINXML-function:', err);
        return reject(err);
      }
      if (result) {
        //console.log('Parsed XML-Daten in dataINXML-function:', result);
        return resolve(result);
      }
    });
  });
}
