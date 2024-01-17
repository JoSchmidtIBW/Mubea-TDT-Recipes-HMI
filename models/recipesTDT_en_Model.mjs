import mongoose from 'mongoose';
import validator from 'validator';

// Validierungsfunktion für achtstellige Nummer
function validateEightDigitNumber(itemNumber) {
  return /^[0-9]{8}$/.test(itemNumber.toString());
}

const recipesTDT_en_Schema = new mongoose.Schema({
  headerData: {
    itemNumber: {
      type: Number,
      required: [true, 'A item-number must have 8 numbers!'], // validator
      validate: {
        validator: validateEightDigitNumber,
        message: 'Not a valid eight-digit-number!',
      },
    },
    productName: {
      type: String,
      required: [true, 'A product-name must have a name!'], // validator
      trim: true, // name and not space-name-space
      maxlength: [
        20,
        'A product-name must have less or equal then 50 characters',
      ], // validator
      minlength: [
        1,
        'A product-name must have more or equal then 5 characters',
      ], // validator
    },
    partNumber: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    blueprintNumber: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    changeBlueprintStatus: {
      type: Number,
      default: 1,
    },
    changeRecipeStatus: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: 'MTTXXXXXXXXX',
      trim: true,
    },
    drawingSpeed: {
      type: String,
      trim: true,
    },
    comment: [
      {
        createdAt: {
          type: Date,
          default: Date.now, // not Date.now(),
          select: false, // than not see it
        },
        user: {
          type: String,
        },
        commentDescription: {
          type: String,
        },
      },
    ],
  },
  tubeValues: {
    minimumGoodShare: {
      type: Number,
      default: 80,
      //ev weg machen
      required: [true, 'Mindest-Gutanteil has to be required!'],
      min: [0, 'minimumGoodShare must be minimum 0'],
      max: [100, 'minimumGoodShare can be maximum 100'],
      validate: {
        validator: Number.isInteger,
        message: 'minimumGoodShare must be a number',
      },
    },
    profileCoupled: {
      type: Number,
    },
  },
  thornValues: {
    tubeOuterDiameterLastDraw: {
      type: Number,
    },
    tubeInnerDiameterLastDraw: {
      type: Number,
    },
    rod: {
      type: Number,
    },
    tubeOuterDiameterTDTDraw: {
      type: Number,
    },
    thornLevels: {
      thornLevel: [
        {
          thornDiameter: {
            type: Number,
          },
          position: {
            type: Number,
          },
          rampIn: {
            type: Number,
            default: 30.0,
          },
          rampOut: {
            type: Number,
            default: 26.0,
          },
          strech: {
            type: Number,
            default: 1.0,
          },
        },
      ],
    },
  },
  multipleLengthData: {
    fixedLength: {
      type: Number,
    },
    compensationPiece: {
      type: Number,
      default: 30,
    },
    multipleLength: {
      type: Number,
    },
    numberOfFixedLengthsPerMultipleLength: {
      type: Number,
      default: 6,
    },
    negativeToleranceMultipleLength: {
      type: Number,
      default: 30,
    },
    positiveToleranceMultipleLength: {
      type: Number,
      default: 150,
    },
    minimumNumberOfGoodProfiles: {
      type: Number,
      default: 2,
    },
  },
  standardValues: {
    upperTolerance: {
      type: Number,
      default: 0.15,
    },
    lowerTolerance: {
      type: Number,
      default: 0.15,
    },
    //mindeest-gutanteil 80 ist doppelt in der liste
  },
  cornerList: {
    corner: [
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

const RecipesTDT_en = mongoose.model(
  'RecipesTDT_en',
  recipesTDT_en_Schema,
  'RecipesTDT_en',
);

export default RecipesTDT_en;
