import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = '0ph4m'; // Replace with your encryption key

// Encrypts the password
export const encryptPassword = (password) => {
  const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY);
  return encryptedPassword.toString();
};

// Decrypts the password
export const decryptPassword = (encryptedPassword) => {
  if (!encryptedPassword) {
    console.error("No encrypted password provided for decryption.");
    return null; // Return null or handle as needed
  }

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
  return decryptedBytes.toString(CryptoJS.enc.Utf8);
};