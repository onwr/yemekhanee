import CryptoJS from "crypto-js";

const key = process.env.REACT_APP_ANAHTAR;

const veriSifrele = (data) => {
  return CryptoJS.Blowfish.encrypt(JSON.stringify(data), key).toString();
};

const sifreCoz = (sifreliData) => {
  const decryptedBytes = CryptoJS.Blowfish.decrypt(sifreliData, key);
  return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
};

export { veriSifrele, sifreCoz };
