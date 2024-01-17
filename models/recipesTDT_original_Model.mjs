import mongoose from 'mongoose';
import validator from 'validator';

// Validierungsfunktion für achtstellige Nummer
function validateEightDigitNumber(artikelnummer) {
  return /^[0-9]{8}$/.test(artikelnummer.toString());
}

const recipesTDT_original_Schema = new mongoose.Schema({
  //kopfdaten
  kopfDaten: {
    artikelnummer: {
      type: Number,
      required: [true, 'A artikel-number must have 8 numbers!'], // validator
      validate: {
        validator: validateEightDigitNumber,
        message: 'Keine gültige achtstellige Nummer',
      },
    },
    artikelname: {
      type: String,
      required: [true, 'A artikel-name must have a artikel-name'], // validator
      trim: true, // name and not space-name-space
      maxlength: [20, 'A firstName must have less or equal then 50 characters'], // validator
      minlength: [1, 'A firstName must have more or equal then 5 characters'], // validator
    },
    teilenummer: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    zeichnungsnummer: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    'aenderungsstand-zeichnung': {
      type: Number,
      default: 1,
    },
    'aenderungsstand-rezept': {
      type: Number,
      default: 1,
    },
    beschreibung: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    //Kommentar
    kommentar: [
      {
        createdAt: {
          type: Date,
          default: Date.now, // not Date.now(),
          select: false, // than not see it
        },
        person: {
          type: String,
        },
        comment: {
          type: String,
        },
        ziehGeschwindigkeit: {
          type: String,
        },
      },
    ],
  },
  // rohrwerte
  rohrWerte: {
    'mindest-gutanteil': {
      type: Number,
      default: 80,
      required: [true, 'Mindest-Gutanteil has to be required!'],
      min: [0, 'Mindest-Gutanteil must be minimum 0'],
      max: [100, 'Mindest-Gutanteil can be maximum 100'],
      validate: {
        validator: Number.isInteger,
        message: 'Mindest-Gutanteil must be a number',
      },
    },
    'profile-gekoppelt': {
      type: Number,
    },
  },
  //dornwerte
  dornWerte: {
    dav: {
      type: Number,
    },
    div: {
      type: Number,
    },
    angel: {
      type: Number,
    },
    dan: {
      type: Number,
    },
    //Stufen, stufe
    stufen: {
      stufe: [
        {
          d: {
            type: Number,
          },
          pos: {
            type: Number,
          },
          'rampe-rein': {
            type: Number,
            default: 30.0,
          },
          'rampe-raus': {
            type: Number,
            default: 26.0,
          },
          dehnung: {
            type: Number,
            default: 1.0,
          },
        },
      ],
    },
  },
  //mehrfachlaengeDaten
  mehrfachlaengenDaten: {
    fixlaenge: {
      type: Number,
    },
    ausgleichstueck: {
      type: Number,
      default: 30,
    },
    mehrfachlaenge: {
      type: Number,
    },
    'anzahl-fixlaengen-pro-mehrfachlaenge': {
      type: Number,
      default: 6,
    },
    'neg-tol-mehrfachlaenge': {
      type: Number,
      default: 30,
    },
    'pos-tol-mehrfachlaenge': {
      type: Number,
      default: 150,
    },
    'mindestanzahl-gutprofile': {
      type: Number,
      default: 2,
    },
  },
  //standartWerte
  standartWerte: {
    'obere-toleranz': {
      type: Number,
      default: 0.15,
    },
    'untere-toleranz': {
      type: Number,
      default: 0.15,
    },
    //mindeest-gutanteil 80 ist doppelt in der liste
  },
  //eckenListe
  eckenListe: {
    ecke: [
      {
        x: {
          type: Number,
        },
        z: {
          type: Number,
        },
      },
    ],
  },
});

const RecipesTDT_original = mongoose.model(
  'RecipesTDT_original',
  recipesTDT_original_Schema,
  'RecipesTDT_original',
);

export default RecipesTDT_original;
