const crypto = require('crypto');
const { ACCESS_KEY, USER_ID } = require('../config/constants');

function generateAuthorization() {
  const version = '2022-05-01';
  const method = 'sha1';
  const res = `userid/${USER_ID}`;
  const et = Math.floor(Date.now() / 1000) + 3600;

  const base64Key = Buffer.from(ACCESS_KEY, 'base64');
  const stringForSignature = `${et}\n${method}\n${res}\n${version}`;
  const sign = crypto.createHmac(method, base64Key)
    .update(stringForSignature)
    .digest('base64');

  return `version=${version}&res=${encodeURIComponent(res)}&et=${et}&method=${method}&sign=${encodeURIComponent(sign)}`;
}

module.exports = { generateAuthorization };
