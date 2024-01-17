import mongoose from 'mongoose';
import validator from 'validator';
import AppError from '../utils/appError.mjs';

function validateEightDigitNumber(artikelnummer) {
  return /^[0-9]{8}$/.test(artikelnummer.toString());
}

export const getTeileNummerDefault = () => 'MTTXXXXXXXXX';
export const getZeichnungsNummerDefault = () => 'MTTXXXXXXXXX';
export const getBeschreibungDefault = () => 'MTTXXXXXXXXX';
export const getAenderungsstandZeichnungDefault = () => 1;
export const getAenderungsstandRezeptDefault = () => 1;
export const getZiehGeschwindigkeitDefault = () => '15m/min';
export const getProfileGekoppeltDefault = () => 1;
export const getMindestGutanteilDefault = () => 80;
export const getRampeReinDefault = () => 30.0;
export const getRampeRausDefault = () => 26.0;
export const getDehnungDefault = () => 1.0;
export const getNegativeToleranzMehrfachlaengeDefault = () => 30;
export const getPositiveToleranzMehrfachlaengeDefault = () => 150;
export const getMindestAnzahlGutprofileDefault = () => 2;

//Bei Änderung im Schema, muss die MongoDB gelöscht werden! Sonst werden die Änderungen nicht übernommen!!!!!!
const recipesTDT_de_Schema = new mongoose.Schema({
  kopfDaten: {
    artikelNummer: {
      type: Number,
      //unique: true, // not two with the same name, it is not a validator
      required: [true, 'A artikel-number must have 8 numbers!'], // validator
      validate: {
        validator: validateEightDigitNumber,
        message: 'Keine gültige achtstellige Nummer',
      },
    },
    artikelName: {
      type: String,
      //unique: true, // not two with the same name, it is not a validator
      // required: [true, 'A artikel-name must have a artikel-name'], // validator
      // trim: true, // name and not space-name-space
      // maxlength: [50, 'A firstName must have less or equal then 50 characters'], // validator
      // minlength: [1, 'A firstName must have more or equal then 1 characters'], // validator
    },
    teileNummer: {
      type: String,
      default: getTeileNummerDefault,
      trim: true,
    },
    zeichnungsNummer: {
      type: String,
      default: getZeichnungsNummerDefault,
      trim: true,
    },
    aenderungsstandZeichnung: {
      type: Number,
      default: getAenderungsstandZeichnungDefault,
    },
    aenderungsstandRezept: {
      type: Number,
      default: getAenderungsstandRezeptDefault,
    },
    beschreibung: {
      type: String,
      default: getBeschreibungDefault,
      trim: true,
    },
    ziehGeschwindigkeit: {
      type: String,
      trim: true,
    },
    kommentar: [
      {
        erstelltAm: {
          type: Date,
          default: Date.now, // not Date.now(),
          //select: false, // than not see it
        },
        // benutzer: {
        //   type: String,
        //   default: 'Max Mustermann',
        // },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        kommentarBeschreibung: {
          type: String,
          default: 'Erstmals Rezept erstellt',
        },
      },
    ],
  },
  rohrWerte: {
    mindestGutanteil: {
      type: Number,
      default: getMindestGutanteilDefault,
      // required: [true, 'Mindest-Gutanteil has to be required!'],
      // min: [0, 'Mindest-Gutanteil must be minimum 0'],
      // max: [100, 'Mindest-Gutanteil can be maximum 100'],
      // validate: {
      //   validator: Number.isInteger,
      //   message: 'Mindest-Gutanteil must be a number',
      // },
    },
    profileGekoppelt: {
      type: Number,
      default: getProfileGekoppeltDefault,
    },
  },
  dornWerte: {
    rohrAussenDurchmesserLetzterZug: {
      type: Number,
    },
    rohrInnenDurchmesserLetzterZug: {
      type: Number,
    },
    angel: {
      type: Number,
    },
    rohrAussenDurchmesserTDTZug: {
      type: Number,
    },
    dornStufen: {
      dornStufe: [
        {
          dornDurchmesser: {
            type: Number,
          },
          position: {
            type: Number,
          },
          rampeRein: {
            type: Number,
            default: getRampeReinDefault,
          },
          rampeRaus: {
            type: Number,
            default: getRampeRausDefault,
          },
          dehnung: {
            type: Number,
            default: getDehnungDefault,
          },
        },
      ],
    },
  },
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
    anzahlFixlaengenProMehrfachlaenge: {
      type: Number,
      default: 6,
    },
    negativeToleranzMehrfachlaenge: {
      type: Number,
      default: getNegativeToleranzMehrfachlaengeDefault,
    },
    positiveToleranzMehrfachlaenge: {
      type: Number,
      default: getPositiveToleranzMehrfachlaengeDefault,
    },
    mindestanzahlGutprofile: {
      type: Number,
      default: getMindestAnzahlGutprofileDefault,
    },
  },
  standartWerte: {
    obereToleranz: {
      type: Number,
      default: 0.15,
    },
    untereToleranz: {
      type: Number,
      default: 0.15,
    },
  },
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

// Pre-Save Middleware (vor Speicherung)für Validierung (Rezept mit gleicher artikelnummer und gleichem artikelname darf nur einmal vorkommen)
recipesTDT_de_Schema.pre('save', async function (next) {
  console.log('Bin pre-save ');
  //console.log('this: ' + this);
  try {
    //console.log('artikelNummer: ', this.kopfDaten.artikelNummer);
    //console.log('artikelName: ', this.kopfDaten.artikelName);

    const existingRezept = await this.constructor.countDocuments({
      'kopfDaten.artikelNummer': parseInt(this.kopfDaten.artikelNummer),
      'kopfDaten.artikelName': this.kopfDaten.artikelName.toString(),
    });
    console.log('existingRezept: ' + existingRezept);

    if (existingRezept) {
      return next(
        new AppError(
          'Ein Rezept mit dieser Artikelnummer und diesem Artikelnamen existiert bereits!',
          400,
        ),
      );
    }
    next();
  } catch (error) {
    console.log('Etwas ging total schief');
    return next(error);
  }
});

const RecipesTDT_de = mongoose.model(
  'RecipesTDT_de',
  recipesTDT_de_Schema,
  'RecipesTDT_de',
);

export default RecipesTDT_de;
