import CryptoJS from 'crypto-js';

const key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);

export function decryptPassword(encryptedPassword) {
  // Parse den kombinierten Wert aus Base64
  let combined = CryptoJS.enc.Base64.parse(encryptedPassword);

  // Extrahiere IV und verschlüsselten Text
  let iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
  let ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));

  let decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encryptPassword(password) {
  let iv = CryptoJS.lib.WordArray.random(16); // Generiere einen zufälligen IV
  let encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Kombiniere IV und verschlüsselten Text und konvertiere in Base64
  let combined = CryptoJS.lib.WordArray.create();
  combined.concat(iv);
  combined.concat(encrypted.ciphertext);

  return combined.toString(CryptoJS.enc.Base64);
}

export default { encryptPassword, decryptPassword };

//----------------------------------------------------ALT-----------------------------------------------------------------------

// import CryptoJS from 'crypto-js';

// var encryptedStringPasswortLClient; // has to be var!

// export function encryptData(data, iv, key) {
//   //  console.log("bin encryptData-Funktion in crypto.mjs");
//   if (typeof data == 'string') {
//     data = data.slice();
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(data, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   } else {
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       },
//     );
//   }
//   return encryptedStringPasswortLClient.toString();
// }

// export function decryptData(encrypted, iv, key) {
//   let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// export default { encryptData, decryptData };
// import CryptoJS from 'crypto-js';

// var encryptedStringPasswortLClient; // has to be var!

// export function encryptData(data, iv, key) {
//   console.log('bin encryptData-Funktion in crypto.mjs');
//   if (typeof data == 'string') {
//     data = data.slice();
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(data, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   } else {
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       },
//     );
//   }
//   return encryptedStringPasswortLClient.toString();
// }

// export function decryptData(encrypted, iv, key) {
//   console.log('bin decryptData-Funktion in crypto.mjs');
//   console.log('bin decryptData-Funktion in crypto.mjs encrypted: ' + encrypted);
//   console.log('bin decryptData-Funktion in crypto.mjs iv: ' + iv);
//   console.log('bin decryptData-Funktion in crypto.mjs key: ' + key);
//   // const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//   //   iv: iv,
//   //   mode: CryptoJS.mode.CBC,
//   //   padding: CryptoJS.pad.Pkcs7,
//   // });

//   console.log('Decrypted data:', decrypted.toString(CryptoJS.enc.Utf8));
//   console.log('bin decryptData-Funktion in crypto.mjs encrypted: ' + encrypted);
//   console.log('bin decryptData-Funktion in crypto.mjs iv: ' + iv);
//   console.log('bin decryptData-Funktion in crypto.mjs key: ' + key);
//   let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   console.log('bin decryptData-Funktion in crypto.mjs decrypted: ' + decrypted);
//   console.log(
//     'bin decryptData-Funktion in crypto.mjs decrypted.toString(CryptoJS.enc.Utf8): ' +
//       decrypted.toString(CryptoJS.enc.Utf8),
//   );
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// export default { encryptData, decryptData };
