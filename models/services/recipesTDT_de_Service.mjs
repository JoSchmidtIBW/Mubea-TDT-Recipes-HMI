import RecipesTDT_de from '../recipesTDT_de_Model.mjs';

export async function getAllRecipesTDT_de() {
  try {
    const allRecipesTDT_de = await RecipesTDT_de.find();
    console.log('allRecipesTDT_de: ' + allRecipesTDT_de);
    return allRecipesTDT_de;
  } catch (err) {
    console.log(`Could not fetch recipesTDT_de: ${error}`);
  }
}

export async function getFindRecipeTDT_deByID(_id) {
  console.log('bin getFindRecipeTDT_deByID');

  try {
    const recipe = await RecipesTDT_de.findOne({ _id }).populate(
      'kopfDaten.kommentar.createdBy',
    ); //.select('+createdAt');
    return recipe;
  } catch (err) {
    console.log(`Could not fetch recipe by ID: ${err}`);
  }
}

export async function createRecipesTDT_de(data) {
  console.log('bin createRecipesTDT_de und habe data: ' + data);
  try {
    const newRecipesTDT_de = {
      kopfDaten: {
        //artikelNummer: JSON.stringify(data.artikelNummerOLDobj),
        //artikelNummer: JSON.stringify(data),

        artikelNummer: data.artikelNummer,
        artikelName: data.artikelName,
        teileNummer: data.teileNummer, // || 'MTTXXXXXXXXX',
        zeichnungsNumnmer: data.zeichnungsNumnmer,
        aenderungsstandZeichnung: data.aenderungsstandZeichnung,
        aenderungsstandRezept: data.aenderungsstandRezept,
        beschreibung: data.beschreibung,
        ziehGeschwindigkeit: data.ziehGeschwindigkeit,
        kommentar: data.kommentar, //[{}],
        // kommentar: [
        //   { erstelltAm: null, benutzer: null, kommentarBeschreibung: null },
        // ],
      },
      dornWerte: {
        rohrAussenDurchmesserLetzterZug: data.rohrAussenDurchmesserLetzterZug,
        rohrInnenDurchmesserLetzterZug: data.rohrInnenDurchmesserLetzterZug,
        angel: data.angel,
        rohrAussenDurchmesserTDTZug: data.rohrAussenDurchmesserTDTZug,
        dornStufen: {
          dornStufe: data.dornStufe,
        },
      },
      mehrfachlaengenDaten: {
        fixlaenge: data.fixLaenge,
        ausgleichstueck: data.ausgleichsstueck,
        mehrfachlaenge: data.mehrfachLaenge,
        anzahlFixlaengenProMehrfachlaenge:
          data.anzahlFixLaengenProMehrfachLaenge,
        negativeToleranzMehrfachlaenge: data.negTolMehrfachLaenge,
        positiveToleranzMehrfachlaenge: data.posTolMehrfachLaenge,
        mindestanzahlGutprofile: data.mindestAnzahlGutProfile,
      },
      standartWerte: {
        obereToleranz: data.obereToleranz,
        untereToleranz: data.untereToleranz,
      },
      rohrWerte: {
        mindestGutanteil: data.mindestGutanteil,
        profileGekoppelt: data.profileGekoppelt,
      },
      eckenListe: {
        ecke: data.ecke,
      },
    };
    const response = await new RecipesTDT_de(newRecipesTDT_de).save({
      runValidators: true,
    });
    console.log('Successfully saved');
    return response;
  } catch (error) {
    console.log(`Something wrong to create a recipesTDT_de${error}`);
    console.error(`Error creating recipesTDT_de: ${error.message}`);
    throw error;
  }
}

export async function getFindRecipesTDTtoLoad() {
  console.log('BIN getFindRecipesTDTtoLoad im Model.service...: ');
  try {
    const allRecipesTDTtoLoad = await RecipesTDT_de.find()
      .sort({
        'kopfDaten.artikelNummer': 1,
      })
      //.populate('kopfDaten.kommentar')
      .populate({
        path: 'kopfDaten.kommentar',
        populate: {
          path: 'createdBy',
          model: 'User',
        },
      })
      .populate('eckenListe.ecke');

    //console.log('allRecipesTDTtoLoad: ' + allRecipesTDTtoLoad);
    // console.log(
    //   'allRecipesTDTtoLoad:',
    //   JSON.stringify(allRecipesTDTtoLoad, null, 2),
    // );

    return allRecipesTDTtoLoad;
  } catch (error) {
    console.log(`Could not fetch recipesTDT_deToLoad ${error}`);
    console.error(`Error creating recipesTDT_de: ${error.message}`);
    throw error;
  }
}

//--------------------------------------------------------------------------------------------------

// const Article = require("../models/Article");

// module.exports = class ArticleService{
//     static async getAllArticles(){
//         try {
//             const allArticles = await  Article.find();
//             return allArticles;
//         } catch (error) {
//             console.log(`Could not fetch articles ${error}`)
//         }
//     }

//     static async createArticle(data){
//         try {

//             const newArticle = {
//                 title: data.title,
//                 body: data.body,
//                 article_image: data.article_image
//             }
//            const response = await new Article(newArticle).save();
//            return response;
//         } catch (error) {
//             console.log(error);
//         }

//     }
//     static async getArticlebyId(articleId){
//         try {
//             const singleArticleResponse =  await Article.findById({_id: articleId});
//             return singleArticleResponse;
//         } catch (error) {
//             console.log(`Article not found. ${error}`)
//         }
//     }

//     static async updateArticle(title, body, articleImage){
//             try {
//                 const updateResponse =  await Article.updateOne(
//                     {title, body, articleImage},
//                     {$set: {date: new Date.now()}});

//                     return updateResponse;
//             } catch (error) {
//                 console.log(`Could not update Article ${error}` );

//         }
//     }

//     static async deleteArticle(articleId){
//         try {
//             const deletedResponse = await Article.findOneAndDelete(articleId);
//             return deletedResponse;
//         } catch (error) {
//             console.log(`Could  ot delete article ${error}`);
//         }

//     }
// }
