import { ObjectId } from 'mongodb';
import User from '../userModel.mjs';

export async function getAllUsers() {
  try {
    const allUsers = await User.find()
      .sort({ articleNumber: 1 })
      .select('+createdAt +password');
    //console.log('allUsers: ' + allUsers);
    return allUsers;
  } catch (err) {
    console.log(`Could not fetch users: ${err}`);
  }
}

export async function getFindUserByID(_id) {
  try {
    const user = await User.findOne({ _id }).select('+createdAt +password');
    return user;
  } catch (err) {
    console.log(`Could not fetch users by ID: ${err}`);
  }
}

export async function updateUserFindByIdAndUpdate(updateUserData, userID) {
  console.log(
    'bin updateUserFindOneAndUpdate und bekomme: ' +
      JSON.stringify(updateUserData) +
      userID,
  );
  try {
    // const updatedUser = await User.findOneAndUpdate(
    //   { _id: ObjectId(userID) }, // Hier wird die ID des Benutzers angegeben
    //   { $set: updateUserData }, // Hier werden die zu aktualisierenden Daten übergeben
    //   { new: true }, // Optional: Gibt das aktualisierte Dokument zurück
    // );

    const updatedUser = await User.findByIdAndUpdate(userID, updateUserData, {
      new: true,
      runValidators: true,
    });
    console.log('Aktualisierter Benutzer:', updatedUser);
    return updatedUser;
  } catch (err) {
    console.log(`Could not update a User ${err}`);
    throw err;
  }
}

export async function saveCreateUser(newUserData) {
  console.log('bin saveCreateUser');
  try {
    const newUser = new User(newUserData);
    const savedUser = await newUser.save();
    console.log('Neuer Benutzer wurde erfolgreich gespeichert:', savedUser);
    return savedUser;
  } catch (err) {
    console.error('Fehler beim Speichern des Benutzers:', err);
    throw err;
  }
}

export async function deleteUserFindOneAndDelete(userID) {
  console.log('bin deleteUser');

  try {
    //const result = await User.deleteOne({ _id: userID });
    const result = await User.findOneAndDelete({ _id: userID });

    if (result !== null) {
      console.log('Benutzer erfolgreich gelöscht');
    } else {
      console.log('Benutzer mit der gegebenen ID nicht gefunden beim Löschen!');
    }

    return result;
  } catch (err) {
    console.log('Fehler beim löschen eines Benutzers!' + err);
    throw err;
  }
}
// const deleteOne = (Model) =>
// catchAsync(async (req, res, next) => {
//   console.log('zum löschen:');
//   console.log(req.params.id);

//   const doc = await Model.findByIdAndDelete(req.params.id);

// });
