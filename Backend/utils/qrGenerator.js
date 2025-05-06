const crypto = require('crypto');
const QRCode = require('qrcode');

// Generate a unique code for the QR
exports.generateUniqueCode = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Generate QR code as data URL
exports.generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};
