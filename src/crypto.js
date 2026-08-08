'use strict';

const crypto = require('node:crypto');

function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function createVault(hexKey) {
  if (!/^[a-f0-9]{64}$/i.test(hexKey)) {
    return {
      available: false,
      encrypt() { throw new Error('Encryption key is unavailable'); },
      decrypt() { throw new Error('Encryption key is unavailable'); }
    };
  }
  const key = Buffer.from(hexKey, 'hex');
  return {
    available: true,
    encrypt(value) {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
      return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString('base64url')).join('.');
    },
    decrypt(value) {
      const [ivText, tagText, encryptedText] = String(value).split('.');
      if (!ivText || !tagText || !encryptedText) throw new Error('Encrypted value is malformed');
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivText, 'base64url'));
      decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
      return Buffer.concat([
        decipher.update(Buffer.from(encryptedText, 'base64url')),
        decipher.final()
      ]).toString('utf8');
    }
  };
}

function googleEventId(seed) {
  return `cb${crypto.createHash('sha256').update(seed).digest('hex').slice(0, 40)}`;
}

module.exports = { createVault, googleEventId, safeEqual, tokenHash };
